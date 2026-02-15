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
            const now = performance.now();

            const target = intent.targetId
                ? state.scene.objects.find(o => o.id === intent.targetId)
                : null;

            const controlled = state.scene.objects.find(o => o.controlled);
            const isControlledSpeaker = !!entity.controlled;
            const directedToControlled =
                !!intent.targetId && !!controlled && intent.targetId === controlled.id;

            // Bubble rules:
            // - Never show a bubble when talking to an NPC (direct target is npc)
            // - Otherwise show a bubble above the speaker
            if (!target || target.type !== "npc") {
                state.chatBubbles.push({
                    entityId: entity.id,
                    text: intent.text,
                    createdAt: now,
                    ttlMs: state.settings.chatBubbleTtlMs
                });
            }

            // Bottom prompt rules:
            // - Controlled speaker: always show bottom prompt.
            // - NPC speaker: show bottom prompt only if directed to controlled.
            const showBottomPrompt = isControlledSpeaker || directedToControlled;
            if (showBottomPrompt) {
                state.uiText = `You say, "${intent.text}"`;
                state.visibleText = "";
                state.typingIndex = 0;
                state.isTyping = true;
                state.lastTypeTime = now;
            }
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
