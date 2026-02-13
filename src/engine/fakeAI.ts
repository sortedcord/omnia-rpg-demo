import type { Intent } from "./intent";
import type { SceneObject } from "../world/scene";

const directions = ["up", "down", "left", "right"] as const;

export function generateIntentForNPC(
    npc: SceneObject
): Intent {
    const r = Math.random();

    if (r < 0.7) {
        // Mostly move randomly
        return {
            type: "move",
            direction: directions[Math.floor(Math.random() * 4)]
        };
    }

    return {
        type: "say",
        text: `${npc.id} mutters something unintelligible...`
    };
}
