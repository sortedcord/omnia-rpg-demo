import type { GameState } from "./gameState";
import type { Interaction, InteractionAction } from "../world/scene";

export function buildInteractionText(interaction: Interaction): string {
    return interaction.text;
}


export function startInteraction(
    state: GameState,
    interaction: Interaction
) {
    state.uiText = buildInteractionText(interaction);
    state.visibleText = "";
    state.typingIndex = 0;
    state.isTyping = true;
    state.lastTypeTime = performance.now();
    state.activeInteraction = interaction;
}

export function applyActions(
    state: GameState,
    actions?: InteractionAction[]
) {
    if (!actions) return;

    for (const action of actions) {
        if (action.type === "set_flag") {
            state.worldState.flags[action.key] = action.value;
        }
    }
}
