import type { Direction, Interaction, Scene } from "../world/scene";

export type WorldState = {
    flags: Record<string, boolean>;
};

export type Player = {
    x: number;
    y: number;
    facing: Direction;
};

export type GameState = {
    scene: Scene;
    player: Player;
    worldState: WorldState;

    // UI / interaction
    uiText: string | null;
    visibleText: string;
    typingIndex: number;
    isTyping: boolean;
    lastTypeTime: number;
    activeInteraction: Interaction | null;
};
