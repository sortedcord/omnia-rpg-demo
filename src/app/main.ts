import { loadScene } from "../world/sceneLoader";
import { isWalkable } from "../engine/collision";
import { renderScene } from "../presentation/render";
import { findInteractable } from "../engine/interact";
import type { Direction, Interaction, InteractionAction, Scene } from "../world/scene";
import { renderTextBar } from "../presentation/ui";
import { drawFacingOutline } from "../presentation/debugFacing";
import { renderInteractPrompt } from "../presentation/hud";

const canvas = document.getElementById("game") as HTMLCanvasElement;
const ctx = canvas.getContext("2d")!;

canvas.width = 640;
canvas.height = 480;

const TYPE_SPEED = 30;

let uiText: string | null = null;
let visibleText = "";
let typingIndex = 0;
let isTyping = false;
let lastTypeTime = 0;
let activeInteraction: Interaction | null = null;
const player = { x: 10, y: 12, facing: "down" as Direction };

type WorldState = {
  flags: Record<string, boolean>;
};

const worldState: WorldState = {
  flags: {}
};


let scene: Scene;

function buildInteractionText(interaction: Interaction): string {
  let text = interaction.text;

  if (interaction.next && interaction.next.length > 0) {
    text += "\n\n";
    interaction.next.forEach((opt, i) => {
      text += `${i + 1}. ${opt.text}\n`;
    });
  }

  return text;
}


function startInteraction(interaction: Interaction) {
  uiText = buildInteractionText(interaction);
  visibleText = "";
  typingIndex = 0;
  isTyping = true;
  lastTypeTime = performance.now();
}

function applyActions(
  actions?: InteractionAction[]
) {
  if (!actions) return;

  for (const action of actions) {
    if (action.type === "set_flag") {
      worldState.flags[action.key] = action.value;
    }
  }
}



function updateTypewriter(time: number) {
  if (!isTyping || !uiText) return;

  if (time - lastTypeTime >= TYPE_SPEED) {
    visibleText += uiText[typingIndex];
    typingIndex++;
    lastTypeTime = time;

    if (typingIndex >= uiText.length) {
      isTyping = false;
    }
  }
}

window.addEventListener("keydown", (e) => {
  if (uiText && isTyping && (e.key === " " || e.key === "Enter")) {
    visibleText = uiText;
    isTyping = false;
    return;
  }

  if (uiText && !isTyping && (e.key === " " || e.key === "Escape")) {
    uiText = null;
    visibleText = "";
    activeInteraction = null;
    return;
  }


  if (uiText) return;

  let next = { ...player };

  if (
    activeInteraction &&
    !isTyping &&
    activeInteraction.next &&
    e.key >= "1" &&
    e.key <= String(activeInteraction.next.length)
  ) {
    const choice =
      activeInteraction.next[Number(e.key) - 1];

    applyActions(choice.actions);
    activeInteraction = choice;
    startInteraction(choice);
    return;
  }


  if (e.key === "w") {
    next.y--;
    player.facing = "up";
  }
  if (e.key === "s") {
    next.y++;
    player.facing = "down";
  }
  if (e.key === "a") {
    next.x--;
    player.facing = "left";
  }
  if (e.key === "d") {
    next.x++;
    player.facing = "right";
  }


  if (e.key === "e" || e.key === "E") {
    // If already inside an interaction chain, do nothing here
    if (activeInteraction) return;

    const obj = findInteractable(scene, player);

    if (!obj || obj.interactions.length === 0) {
      uiText = "Nothing to interact with.";
      visibleText = "";
      typingIndex = 0;
      isTyping = true;
      lastTypeTime = performance.now();
      return;
    }

    activeInteraction = obj.interactions[0];
    startInteraction(activeInteraction);
    return;
  }


  if (isWalkable(scene, next)) {
    player.x = next.x;
    player.y = next.y;
  }
});

function loop(time: number) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  renderScene(ctx, scene);


  // Player
  ctx.fillStyle = "white";
  ctx.fillRect(player.x * 32, player.y * 32, 32, 32);

  drawFacingOutline(
    ctx,
    player.x,
    player.y,
    1,
    1,
    player.facing
  )

  if (!uiText) {
    const obj = findInteractable(scene, player);

    if (obj) {
      const name =
        obj.type === "npc"
          ? "Interact with NPC"
          : `Interact with ${obj.type}`;

      renderInteractPrompt(ctx, name);
    }
  }


  updateTypewriter(time);

  if (uiText) {
    renderTextBar(ctx, visibleText);
  }

  requestAnimationFrame(loop);
}

async function init() {
  scene = await loadScene("/scenes/classroom/classroom.json");
  requestAnimationFrame(loop);
}

init();
