import type { Scene } from "../world/scene";

const TILE = 32;

export function renderScene(
  ctx: CanvasRenderingContext2D,
  scene: Scene
) {
  // background
  ctx.fillStyle = "#444";
  ctx.fillRect(
    0,
    0,
    scene.size.width * TILE,
    scene.size.height * TILE
  );

  // objects
  for (const obj of scene.objects) {
    if (obj.type === "npc") {
      ctx.fillStyle = "#3f51b5"; // blue
    } else if (obj.blocking) {
      ctx.fillStyle = "#795548"; // brown
    } else {
      ctx.fillStyle = "#aaa";
    }
    ctx.fillRect(
      obj.pos.x * TILE,
      obj.pos.y * TILE,
      obj.size.w * TILE,
      obj.size.h * TILE
    );
  }
}

