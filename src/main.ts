import { loadScene } from "./sceneLoader";
import { isWalkable } from "./collision";
import { renderScene } from "./render";
import { findInteractable } from "./interact";
import type { Scene } from "./scene";
import { renderTextBar } from "./ui";

const canvas = document.getElementById("game") as HTMLCanvasElement;
const ctx = canvas.getContext("2d")!;

canvas.width = 640;
canvas.height = 480;

const TYPE_SPEED = 30;

// ───────── UI State ─────────
let uiText: string | null = null;
let visibleText = "";
let typingIndex = 0;
let isTyping = false;
let lastTypeTime = 0;

// ───────── Player ─────────
const player = { x: 10, y: 12 };

// ───────── Scene ─────────
let scene: Scene;

// ───────── Typewriter ─────────
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

// ───────── Input ─────────
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

  // Lock movement during dialogue
  if (uiText) return;

  let next = { ...player };

  if (e.key === "w") next.y--;
  if (e.key === "s") next.y++;
  if (e.key === "a") next.x--;
  if (e.key === "d") next.x++;

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

// ───────── Game Loop ─────────
function loop(time: number) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  renderScene(ctx, scene);

  // Player
  ctx.fillStyle = "white";
  ctx.fillRect(player.x * 32, player.y * 32, 32, 32);

  updateTypewriter(time);

  if (uiText) {
    renderTextBar(ctx, visibleText);
  }

  requestAnimationFrame(loop);
}

// ───────── Init ─────────
async function init() {
  scene = await loadScene("/scenes/classroom.json");
  requestAnimationFrame(loop);
}

init();
