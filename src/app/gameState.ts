import type { Interaction, Scene } from "../world/scene";

export type WorldState = {
    flags: Record<string, boolean>;
};

export type ChatBubble = {
    entityId: string;
    text: string;
    createdAt: number;
    ttlMs: number;
};


export type GameState = {
    scene: Scene;
    worldState: WorldState;

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

