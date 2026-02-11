import { loadScene } from "../world/sceneLoader";
import { isWalkable } from "../engine/collision";
import { findInteractable } from "../engine/interact";
import { renderScene } from "../presentation/render";
import { renderTextBar } from "../presentation/ui";
import { renderInteractPrompt } from "../presentation/hud";
import { drawFacingOutline } from "../presentation/debugFacing";
import { renderChoices } from "../presentation/choices";

import type { Scene } from "../world/scene";
import type { GameState } from "./gameState";

import {
  startInteraction,
  applyActions
} from "./interactionController";

import { updateTypewriter } from "./typewriter";

const canvas = document.getElementById("game") as HTMLCanvasElement;
const ctx = canvas.getContext("2d")!;

canvas.width = 640;
canvas.height = 480;

let state: GameState;

window.addEventListener("keydown", (e) => {
  // Finish typing
  if (state.uiText && state.isTyping && (e.key === " " || e.key === "Enter")) {
    state.visibleText = state.uiText;
    state.isTyping = false;
    return;
  }

  // Close interaction
  if (state.uiText && !state.isTyping && (e.key === " " || e.key === "Escape")) {
    state.uiText = null;
    state.visibleText = "";
    state.activeInteraction = null;
    return;
  }

  // Choice selection
  if (
    state.activeInteraction &&
    !state.isTyping &&
    state.activeInteraction.next &&
    e.key >= "1" &&
    e.key <= String(state.activeInteraction.next.length)
  ) {
    const choice =
      state.activeInteraction.next[Number(e.key) - 1];

    applyActions(state, choice.actions);
    startInteraction(state, choice);
    return;
  }

  if (state.uiText) return;

  const controlled = getControlled(state.scene);
  let next = { x: controlled.pos.x, y: controlled.pos.y };

  if (e.key === "w") {
    next.y--;
    controlled.facing = "up";
  }
  if (e.key === "s") {
    next.y++;
    controlled.facing = "down";
  }
  if (e.key === "a") {
    next.x--;
    controlled.facing = "left";
  }
  if (e.key === "d") {
    next.x++;
    controlled.facing = "right";
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

    startInteraction(state, obj.interactions[0]);
    return;
  }

  if (isWalkable(state.scene, next)) {
    controlled.pos.x = next.x;
    controlled.pos.y = next.y;
  }
});

function loop(time: number) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  renderScene(ctx, state.scene);

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
    const obj = findInteractable(state.scene, { x: controlled.pos.x, y: controlled.pos.y, facing: controlled.facing });
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

  if (state.uiText) {
    renderTextBar(ctx, state.visibleText);

    if (
      state.activeInteraction &&
      !state.isTyping &&
      state.activeInteraction.next
    ) {
      renderChoices(ctx, state.activeInteraction);
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
    worldState: { flags: {} },
    uiText: null,
    visibleText: "",
    typingIndex: 0,
    isTyping: false,
    lastTypeTime: 0,
    activeInteraction: null
  };

  requestAnimationFrame(loop);
}

init();
