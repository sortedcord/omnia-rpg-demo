import { loadScene } from "../world/sceneLoader";
import { findInteractable } from "../engine/interact";
import { renderScene } from "../presentation/render";
import { renderTextBar } from "../presentation/ui";
import { renderInteractPrompt } from "../presentation/hud";
import { drawFacingOutline } from "../presentation/debugFacing";
import { renderChoices } from "../presentation/choices";
import { pruneChatBubbles, renderChatBubbles } from "../presentation/chatBubbles";
import { renderDevHUD } from "../presentation/devHud.ts";

import type { Scene } from "../world/scene";
import type { GameState } from "./gameState";

import {
  startInteraction,
  applyActions
} from "./interactionController";

import { updateTypewriter } from "./typewriter";
import { executeIntent, executeIntentForEntity } from "../engine/intentExecutor";
import { generateIntentForNPC } from "../engine/fakeAI";

const canvas = document.getElementById("game") as HTMLCanvasElement;
const ctx = canvas.getContext("2d")!;

canvas.width = 640;
canvas.height = 480;

let state: GameState;

function getInteractionOptions(state: GameState) {
  if (!state.activeInteraction) return [];

  const baseOptions = state.activeInteraction.next ?? [];

  const genericOptions: typeof baseOptions = [
    { id: "generic_say", text: "Say..." },
    { id: "generic_do", text: "Do..." }
  ];

  return [...baseOptions, ...genericOptions];
}


window.addEventListener("keydown", (e) => {
  // INPUT MODE HAS HIGHEST PRIORITY
  if (state.inputMode) {
    if (e.key === "Enter") {
      // Preserve where we are in the interaction tree so after the say/do text
      // plays the player can continue from the same menu.
      const resumeInteraction = state.activeInteraction;

      const intent = {
        type: state.inputMode,
        text: state.inputBuffer,
        targetId: state.inputTargetId ?? undefined
      };

      executeIntent(state, intent as any);

      state.inputMode = null;
      state.inputBuffer = "";
      state.inputTargetId = null;
      state.activeInteraction = resumeInteraction;

      return;
    }

    if (e.key === "Escape") {
      state.inputMode = null;
      state.inputBuffer = "";
      state.inputTargetId = null;
      state.uiText = null;
      state.visibleText = "";
      state.activeInteraction = null;
      return;
    }

    if (e.key === "Backspace") {
      state.inputBuffer = state.inputBuffer.slice(0, -1);
      return;
    }

    if (e.key.length === 1) {
      state.inputBuffer += e.key;
      return;
    }

    return;
  }

  // Finish typing
  if (state.uiText && state.isTyping && (e.key === " " || e.key === "Enter")) {
    state.visibleText = state.uiText;
    state.isTyping = false;
    return;
  }

  // Close interaction / dialogue (Escape only)
  if (state.uiText && !state.isTyping && e.key === "Escape") {
    state.uiText = null;
    state.visibleText = "";
    state.inputMode = null;
    state.inputBuffer = "";
    state.inputTargetId = null;
    return;
  }

  // Choice selection
  if (state.activeInteraction && !state.isTyping) {
    const options = getInteractionOptions(state);

    if (e.key >= "1" && e.key <= String(options.length)) {
      const choice = options[Number(e.key) - 1];

      if (choice.id === "generic_say") {
        state.inputMode = "say";
        state.inputBuffer = "";
        state.inputTargetId = state.currentTargetId;
        state.uiText = "You say:";
        return;
      }

      if (choice.id === "generic_do") {
        state.inputMode = "do";
        state.inputBuffer = "";
        state.inputTargetId = state.currentTargetId;
        state.uiText = "Enter your action:";
        return;
      }

      applyActions(state, choice.actions ?? []);
      startInteraction(state, choice);
      return;
    }
  }

  if (e.key === "w") {
    executeIntent(state, { type: "move", direction: "up" });
  }
  if (e.key === "s") {
    executeIntent(state, { type: "move", direction: "down" });
  }

  if (e.key === "a") {
    executeIntent(state, { type: "move", direction: "left" });
  }
  if (e.key === "d") {
    executeIntent(state, { type: "move", direction: "right" });
  }

  if (e.key === "e" || e.key === "E") {
    const controlled = getControlled(state.scene);

    const obj = findInteractable(state.scene, {
      x: controlled.pos.x,
      y: controlled.pos.y,
      facing: controlled.facing ?? "down"
    });


    if (!obj || obj.interactions.length === 0) {
      state.uiText = "Nothing to interact with.";
      state.visibleText = "";
      state.typingIndex = 0;
      state.isTyping = true;
      state.lastTypeTime = performance.now();
      return;
    }

    state.currentTargetId = obj.id;
    startInteraction(state, obj.interactions[0]);


    return;
  }

  // if (isWalkable(state.scene, next)) {
  //   controlled.pos.x = next.x;
  //   controlled.pos.y = next.y;
  // }
});

let lastNPCTick = 0;
const NPC_TICK_INTERVAL = 1000; // 1 second

function loop(time: number) {
  state.chatBubbles = pruneChatBubbles(state.chatBubbles, time);

  if (time - lastNPCTick > NPC_TICK_INTERVAL) {
    lastNPCTick = time;

    for (const obj of state.scene.objects) {
      if (obj.type !== "npc") continue;
      if (obj.controlled) continue; // skip player

      const intent = generateIntentForNPC(obj);

      executeIntentForEntity(state, obj, intent);
    }
  }

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  renderScene(ctx, state.scene);

  renderChatBubbles(ctx, state.scene, state.chatBubbles);

  renderDevHUD(ctx, state);

  const controlled = getControlled(state.scene);

  ctx.fillStyle = "white";
  ctx.fillRect(
    controlled.pos.x * 32,
    controlled.pos.y * 32,
    controlled.size.w * 32,
    controlled.size.h * 32
  );

  drawFacingOutline(
    ctx,
    controlled.pos.x,
    controlled.pos.y,
    1,
    1,
    controlled.facing ?? "down"
  );

  if (!state.uiText) {
    const obj = findInteractable(state.scene, {
      x: controlled.pos.x,
      y: controlled.pos.y,
      facing: controlled.facing ?? "down"
    });
    if (obj) {
      renderInteractPrompt(
        ctx,
        obj.type === "npc"
          ? "Interact with NPC"
          : `Interact with ${obj.type}`
      );
    }
  }

  updateTypewriter(state, time);

  if (state.inputMode) {
    renderTextBar(ctx, `${state.uiText}\n> ${state.inputBuffer}`);
  } else if (state.uiText) {
    renderTextBar(ctx, state.visibleText);

    if (state.activeInteraction && !state.isTyping) {
      const options = getInteractionOptions(state);

      renderChoices(ctx, {
        ...state.activeInteraction,
        next: options
      });
    }
  }

  requestAnimationFrame(loop);
}

function getControlled(scene: Scene) {
  const entity = scene.objects.find(o => o.controlled);
  if (!entity) throw new Error("No controlled entity found.");
  return entity;
}

async function init() {
  const scene: Scene = await loadScene("/scenes/classroom/classroom.json");

  state = {
    scene,
    worldState: {
      flags: {},
      time: { day: 1, hour: 9, minute: 0 },
      health: 100,
      inventory: []
    },

    chatBubbles: [],
    uiText: null,
    visibleText: "",
    typingIndex: 0,
    isTyping: false,
    lastTypeTime: 0,
    activeInteraction: null,
    inputMode: null,
    inputBuffer: "",
    inputTargetId: null,
    currentTargetId: null
  };

  requestAnimationFrame(loop);
}

init();
