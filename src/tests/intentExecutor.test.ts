import { describe, it, expect } from "vitest";
import { executeIntentForEntity } from "../engine/intentExecutor";
import type { GameState } from "../app/gameState";
import type { SceneObject, Scene } from "../world/scene";

function makeState(): GameState {
    const scene: Scene = {
        id: "test",
        type: "test",
        size: { width: 1, height: 1 },
        description: "",
        objects: []
    };

    return {
        scene,
        worldState: { flags: {} },
        uiText: null,
        visibleText: "",
        typingIndex: 0,
        isTyping: false,
        lastTypeTime: 0,
        activeInteraction: null,
        inputMode: null,
        inputBuffer: "",
        inputTargetId: null,
        currentTargetId: null
    };
}

function makeEntity(): SceneObject {
    return {
        id: "player",
        type: "player",
        pos: { x: 0, y: 0 },
        size: { w: 1, h: 1 },
        blocking: false,
        controlled: true,
        interactions: []
    };
}

describe("executeIntentForEntity say/do", () => {
    it("formats say as: You say, \"text\"", () => {
        const state = makeState();
        const entity = makeEntity();
        state.scene.objects.push(entity);

        executeIntentForEntity(state, entity, { type: "say", text: "hello" });

        expect(state.uiText).toBe('You say, "hello"');
        expect(state.isTyping).toBe(true);
    });

    it("formats do as: You do text", () => {
        const state = makeState();
        const entity = makeEntity();
        state.scene.objects.push(entity);

        executeIntentForEntity(state, entity, { type: "do", text: "a flip" });

        expect(state.uiText).toBe("You do a flip");
        expect(state.isTyping).toBe(true);
    });
});
