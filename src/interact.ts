import type { Scene, SceneObject, Direction, Vec2 } from "./scene";

export function facingOffset(dir: Direction): Vec2 {
  switch (dir) {
    case "up": return { x: 0, y: -1 };
    case "down": return { x: 0, y: 1 };
    case "left": return { x: -1, y: 0 };
    case "right": return { x: 1, y: 0 };
  }
}

export function findInteractable(
  scene: Scene,
  player: { x: number; y: number; facing: Direction }
): SceneObject | null {
  const offset = facingOffset(player.facing);

  const targetX = player.x + offset.x;
  const targetY = player.y + offset.y;

  for (const obj of scene.objects) {
    if (obj.interactions.length === 0) continue;

    const insideX =
      targetX >= obj.pos.x &&
      targetX < obj.pos.x + obj.size.w;

    const insideY =
      targetY >= obj.pos.y &&
      targetY < obj.pos.y + obj.size.h;

    if (insideX && insideY) {
      return obj;
    }
  }

  return null;
}



