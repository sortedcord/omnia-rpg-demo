export type Intent =
    | {
        type: "move";
        direction: "up" | "down" | "left" | "right";
    }
    | {
        type: "interact";
        targetId: string;
    }
    | {
        type: "say";
        text: string;
        targetId?: string;
    }
    | {
        type: "do";
        text: string;
        targetId?: string;
    };
