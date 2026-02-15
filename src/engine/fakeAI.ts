import type { Intent } from "./intent";
import type { SceneObject } from "../world/scene";
import type { GameState } from "../app/gameState";

const directions = ["up", "down", "left", "right"] as const;

export function generateIntentForNPC(
    _npc: SceneObject
): Intent {
    const r = Math.random();

    if (r < 0.7) {
        return {
            type: "move",
            direction: directions[Math.floor(Math.random() * 4)]
        };
    }

    return {
        type: "say",
        text: "...mutter mutter..."
    };
}

/**
 * React to player-generated intents.
 */
export function generateReaction(
    _state: GameState,
    _actor: SceneObject,
    target: SceneObject | null,
    intent: Intent
): Intent | null {
    if (intent.type === "say") {
        if (target?.type === "npc") {
            return {
                type: "say",
                text: `"Why did you say '${intent.text}'?"`
            };
        }
    }

    if (intent.type === "do") {
        if (target?.id === "blackboard") {
            return {
                type: "say",
                text: "The chalk dust shifts slightly as you act upon the board..."
            };
        }

        if (target?.type === "npc") {
            return {
                type: "move",
                direction: "down"
            };
        }
    }

    if (intent.type === "interact") {
        if (target?.type === "npc") {
            return {
                type: "say",
                text: "...looks at you cautiously."
            };
        }
    }

    return null;
}
