import type { Scene } from "./scene";

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
    ctx.fillStyle = obj.blocking ? "#795548" : "#aaa";
    ctx.fillRect(
      obj.pos.x * TILE,
      obj.pos.y * TILE,
      obj.size.w * TILE,
      obj.size.h * TILE
    );
  }
}

