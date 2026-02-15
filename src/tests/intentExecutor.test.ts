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
        worldState: {
            flags: {},
            time: { day: 1, hour: 9, minute: 0 },
            health: 100,
            inventory: []
        },

        settings: {
            showDevHud: true,
            npcTickMs: 1000,
            chatBubbleTtlMs: 4000,
            typeSpeedMs: 30
        },
        chatBubbles: [],
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
        expect(state.chatBubbles).toHaveLength(1);
        expect(state.chatBubbles[0].entityId).toBe("player");
        expect(state.chatBubbles[0].text).toBe("hello");
    });

    it("formats do as: You do text", () => {
        const state = makeState();
        const entity = makeEntity();
        state.scene.objects.push(entity);

        executeIntentForEntity(state, entity, { type: "do", text: "a flip" });

        expect(state.uiText).toBe("You do a flip");
        expect(state.isTyping).toBe(true);
    });

    it("shows bubble-only for NPC say not directed at controlled", () => {
        const state = makeState();
        const player = makeEntity();
        const npc: SceneObject = {
            id: "npc1",
            type: "npc",
            pos: { x: 0, y: 0 },
            size: { w: 1, h: 1 },
            blocking: false,
            interactions: []
        };

        state.scene.objects.push(player, npc);

        executeIntentForEntity(state, npc, {
            type: "say",
            text: "nice weather"
        });

        expect(state.chatBubbles).toHaveLength(1);
        expect(state.chatBubbles[0].entityId).toBe("npc1");
        expect(state.chatBubbles[0].text).toBe("nice weather");

        // No bottom prompt text for NPC chatter not aimed at the controlled.
        expect(state.uiText).toBe(null);
    });

    it("does not create a bubble when targeting an NPC", () => {
        const state = makeState();
        const player = makeEntity();
        const npc: SceneObject = {
            id: "npc1",
            type: "npc",
            pos: { x: 0, y: 0 },
            size: { w: 1, h: 1 },
            blocking: false,
            interactions: []
        };

        state.scene.objects.push(player, npc);

        executeIntentForEntity(state, player, {
            type: "say",
            text: "hi",
            targetId: "npc1"
        });

        expect(state.chatBubbles).toHaveLength(0);
        expect(state.uiText).toBe('You say, "hi"');
    });

    it("shows both bubble and bottom prompt when player talks to an object", () => {
        const state = makeState();
        const player = makeEntity();
        const desk: SceneObject = {
            id: "desk1",
            type: "desk",
            pos: { x: 0, y: 0 },
            size: { w: 1, h: 1 },
            blocking: true,
            interactions: []
        };

        state.scene.objects.push(player, desk);

        executeIntentForEntity(state, player, {
            type: "say",
            text: "what a mess!",
            targetId: "desk1"
        });

        expect(state.uiText).toBe('You say, "what a mess!"');
        expect(state.chatBubbles).toHaveLength(1);
        expect(state.chatBubbles[0].entityId).toBe("player");
    });

    it("shows bottom prompt when NPC talks to controlled, but no bubble when targeting npc rules apply", () => {
        const state = makeState();
        const player = makeEntity();
        const npc: SceneObject = {
            id: "npc1",
            type: "npc",
            pos: { x: 0, y: 0 },
            size: { w: 1, h: 1 },
            blocking: false,
            interactions: []
        };

        state.scene.objects.push(player, npc);

        executeIntentForEntity(state, npc, {
            type: "say",
            text: "hello",
            targetId: "player"
        });

        expect(state.uiText).toBe('You say, "hello"');
    });
});
