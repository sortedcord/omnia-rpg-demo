import type { Interaction, Scene } from "../world/scene";

export type WorldState = {
    flags: Record<string, boolean>;

    time: {
        day: number;
        hour: number;
        minute: number;
    };

    health: number;
    inventory: string[];
};

export type ChatBubble = {
    entityId: string;
    text: string;
    createdAt: number;
    ttlMs: number;
};

export type GameSettings = {
    showDevHud: boolean;
    npcTickMs: number;
    chatBubbleTtlMs: number;
    typeSpeedMs: number;
};


export type GameState = {
    scene: Scene;
    worldState: WorldState;

    settings: GameSettings;

    chatBubbles: ChatBubble[];

    uiText: string | null;
    visibleText: string;
    typingIndex: number;
    isTyping: boolean;
    lastTypeTime: number;
    activeInteraction: Interaction | null;
    inputMode: null | "say" | "do";
    inputBuffer: string;
    inputTargetId: string | null;

    currentTargetId: string | null;

};

