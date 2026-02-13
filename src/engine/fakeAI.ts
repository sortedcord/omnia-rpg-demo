import type { Intent } from "./intent";
import type { SceneObject } from "../world/scene";

const directions = ["up", "down", "left", "right"] as const;

export function generateIntentForNPC(
    npc: SceneObject
): Intent {

    return {
        type: "move",
        direction: directions[Math.floor(Math.random() * 4)]
    };

}
