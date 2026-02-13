import type { GameState } from "../app/gameState";
import type { Intent } from "./intent";
import { isWalkable } from "./collision";
import type { SceneObject } from "../world/scene";

export function executeIntent(state: GameState, intent: Intent) {
    const controlled = state.scene.objects.find(o => o.controlled);
    if (!controlled) return;

    executeIntentForEntity(state, controlled, intent);
}

export function executeIntentForEntity(
    state: GameState,
    entity: SceneObject,
    intent: Intent
) {
    switch (intent.type) {
        case "move": {
            const next = {
                x: entity.pos.x,
                y: entity.pos.y
            };

            if (intent.direction === "up") next.y--;
            if (intent.direction === "down") next.y++;
            if (intent.direction === "left") next.x--;
            if (intent.direction === "right") next.x++;

            entity.facing = intent.direction;

            if (isWalkable(state.scene, next, entity.id)) {
                entity.pos.x = next.x;
                entity.pos.y = next.y;
            }

            break;
        }

        case "say": {
            state.uiText = `You say, "${intent.text}"`;
            state.visibleText = "";
            state.typingIndex = 0;
            state.isTyping = true;
            state.lastTypeTime = performance.now();
            break;
        }

        case "do": {
            state.uiText = `You do ${intent.text}`;
            state.visibleText = "";
            state.typingIndex = 0;
            state.isTyping = true;
            state.lastTypeTime = performance.now();
            break;
        }
    }
}
