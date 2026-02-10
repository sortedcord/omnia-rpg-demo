import { loadScene } from "./sceneLoader";
import { isWalkable } from "./collision";
import { renderScene } from "./render";
import { findInteractable } from "./interact";
import type { Direction, Scene } from "./scene";
import { renderTextBar } from "./ui";
import { drawFacingOutline } from "./debugFacing";

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

const player = { x: 10, y: 12, facing: "down" as Direction };

let scene: Scene;

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
  // Finish typing instantly
  if (uiText && isTyping && (e.key === " " || e.key === "Enter")) {
    visibleText = uiText;
    isTyping = false;
    return;
  }

  // Close dialogue
  if (uiText && !isTyping && (e.key === " " || e.key === "Escape")) {
    uiText = null;
    visibleText = "";
    return;
  }

  if (uiText) return;

  let next = { ...player };

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
    const obj = findInteractable(scene, player);

    if (obj && obj.interactions.length > 0) {
      const interaction =
        obj.interactions.find(i => i.type === "talk") ??
        obj.interactions[0];

      uiText = `[${interaction.type}] ${interaction.description}`;
      visibleText = "";
      typingIndex = 0;
      isTyping = true;
      lastTypeTime = performance.now();
    } else {
      uiText = "Nothing to interact with.";
      visibleText = "";
      typingIndex = 0;
      isTyping = true;
      lastTypeTime = performance.now();
    }

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
