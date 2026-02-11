import type { Direction, Interaction, Scene } from "../world/scene";

export type WorldState = {
    flags: Record<string, boolean>;
};


export type GameState = {
    scene: Scene;
    worldState: WorldState;

    uiText: string | null;
    visibleText: string;
    typingIndex: number;
    isTyping: boolean;
    lastTypeTime: number;
    activeInteraction: Interaction | null;
};

