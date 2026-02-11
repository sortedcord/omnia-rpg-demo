import type { Scene } from "../world/scene";

export function validatorScene(scene: Scene): Scene {
    if (
        scene.size.width <= 0 || scene.size.height <= 0
    ) {
        throw new Error("Invalid Scene Size");
    }

    for (const obj of scene.objects) {
        if (obj.size.w <= 0 || obj.size.h <= 0) {
            throw new Error(`Invalid size for ${obj.id}`);
        }

        if (
            obj.pos.x < 0 ||
            obj.pos.y < 0 ||
            obj.pos.x + obj.size.w > scene.size.width ||
            obj.pos.y + obj.size.h > scene.size.height) {
            throw new Error(`Object out of bounds: ${obj.id}`);
        }

    }
    for (let i = 0; i < scene.objects.length; i++) {
        for (let j = i + 1; j < scene.objects.length; j++) {
            const a = scene.objects[i];
            const b = scene.objects[j];

            if (!a.blocking || !b.blocking) continue;

            const overlap =
                a.pos.x < b.pos.x + b.size.w &&
                a.pos.x + a.size.w > b.pos.x &&
                a.pos.y < b.pos.y + b.size.h &&
                a.pos.y + a.size.h > b.pos.y;

            if (overlap) {
                throw new Error(
                    `Blocking objects overlap: ${a.id}, ${b.id}`
                );
            }
        }
    }

    // Only one controlled entity allowed
    const controlled = scene.objects.filter(o => o.controlled);
    if (controlled.length > 1) {
        throw new Error("Only one entity can be controlled at a time.");
    }


    return scene;
}