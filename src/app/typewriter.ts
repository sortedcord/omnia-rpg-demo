import type { GameState } from "./gameState";

export function updateTypewriter(state: GameState, time: number) {
    if (!state.isTyping || !state.uiText) return;

    const typeSpeed = state.settings.typeSpeedMs;

    if (time - state.lastTypeTime >= typeSpeed) {
        state.visibleText += state.uiText[state.typingIndex];
        state.typingIndex++;
        state.lastTypeTime = time;

        if (state.typingIndex >= state.uiText.length) {
            state.isTyping = false;
        }
    }
}
