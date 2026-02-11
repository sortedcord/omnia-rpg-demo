import type { GameState } from "./gameState";

const TYPE_SPEED = 30;

export function updateTypewriter(state: GameState, time: number) {
    if (!state.isTyping || !state.uiText) return;

    if (time - state.lastTypeTime >= TYPE_SPEED) {
        state.visibleText += state.uiText[state.typingIndex];
        state.typingIndex++;
        state.lastTypeTime = time;

        if (state.typingIndex >= state.uiText.length) {
            state.isTyping = false;
        }
    }
}
