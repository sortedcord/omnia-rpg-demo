import type { GameSettings } from "./gameState";

const STORAGE_KEY = "rpg-demo:settings:v1";

export function defaultSettings(): GameSettings {
    return {
        showDevHud: true,
        npcTickMs: 1000,
        chatBubbleTtlMs: 4000,
        typeSpeedMs: 30
    };
}

export function loadSettings(): GameSettings {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return defaultSettings();

        const parsed = JSON.parse(raw) as Partial<GameSettings>;
        return {
            ...defaultSettings(),
            ...parsed
        };
    } catch {
        return defaultSettings();
    }
}

export function saveSettings(settings: GameSettings) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
}
