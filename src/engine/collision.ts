import type { Scene, Vec2 } from "../world/scene";

export function isWalkable(
  scene: Scene,
  pos: Vec2,
  ignoreId?: string
): boolean {
  // scene bounds
  if (
    pos.x < 0 ||
    pos.y < 0 ||
    pos.x >= scene.size.width ||
    pos.y >= scene.size.height
  ) {
    return false;
  }

  // object collisions
  for (const obj of scene.objects) {
    if (!obj.blocking) continue;
    if (obj.id === ignoreId) continue;


    const withinX =
      pos.x >= obj.pos.x &&
      pos.x < obj.pos.x + obj.size.w;

    const withinY =
      pos.y >= obj.pos.y &&
      pos.y < obj.pos.y + obj.size.h;

    if (withinX && withinY) {
      return false;
    }
  }

  return true;
}
