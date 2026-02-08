import type { Scene, Vec2, SceneObject } from "./scene";

export function findInteractable(
  scene: Scene,
  player: Vec2
): SceneObject | null {
  for (const obj of scene.objects) {
    const nearX =
      player.x >= obj.pos.x - 1 &&
      player.x <= obj.pos.x + obj.size.w;

    const nearY =
      player.y >= obj.pos.y - 1 &&
      player.y <= obj.pos.y + obj.size.h;

    if (nearX && nearY && obj.interactions.length > 0) {
      return obj;
    }
  }

  return null;
}
