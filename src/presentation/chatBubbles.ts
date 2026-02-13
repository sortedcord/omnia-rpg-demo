import type { Scene } from "../world/scene";
import type { ChatBubble } from "../app/gameState";

const TILE = 32;

export function pruneChatBubbles(bubbles: ChatBubble[], now: number): ChatBubble[] {
    return bubbles.filter(b => now - b.createdAt <= b.ttlMs);
}

function wrapLines(
    ctx: CanvasRenderingContext2D,
    text: string,
    maxWidth: number
): string[] {
    const words = text.split(/\s+/).filter(Boolean);
    const lines: string[] = [];

    let line = "";
    for (const word of words) {
        const test = line ? `${line} ${word}` : word;
        if (ctx.measureText(test).width > maxWidth && line) {
            lines.push(line);
            line = word;
        } else {
            line = test;
        }
    }
    if (line) lines.push(line);
    return lines;
}

export function renderChatBubbles(
    ctx: CanvasRenderingContext2D,
    scene: Scene,
    bubbles: ChatBubble[]
) {
    if (bubbles.length === 0) return;

    ctx.save();

    ctx.font = "14px monospace";
    ctx.textAlign = "center";
    ctx.textBaseline = "top";

    for (const bubble of bubbles) {
        const obj = scene.objects.find(o => o.id === bubble.entityId);
        if (!obj) continue;

        const maxTextWidth = 180;
        const paddingX = 10;
        const paddingY = 8;
        const lineHeight = 18;

        const lines = wrapLines(ctx, bubble.text, maxTextWidth);
        const textWidth = Math.min(
            maxTextWidth,
            Math.max(...lines.map(l => ctx.measureText(l).width), 0)
        );

        const w = textWidth + paddingX * 2;
        const h = lines.length * lineHeight + paddingY * 2;

        const entityCenterX = (obj.pos.x + obj.size.w / 2) * TILE;
        const entityTopY = obj.pos.y * TILE;

        const x = entityCenterX - w / 2;
        const y = entityTopY - h - 10;

        // bubble background
        ctx.fillStyle = "rgba(255,255,255,0.92)";
        ctx.strokeStyle = "rgba(0,0,0,0.9)";
        ctx.lineWidth = 2;

        roundRect(ctx, x, y, w, h, 8);
        ctx.fill();
        ctx.stroke();

        // tail
        ctx.beginPath();
        ctx.moveTo(entityCenterX - 8, y + h);
        ctx.lineTo(entityCenterX + 8, y + h);
        ctx.lineTo(entityCenterX, y + h + 10);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // text
        ctx.fillStyle = "black";
        for (let i = 0; i < lines.length; i++) {
            ctx.fillText(lines[i], entityCenterX, y + paddingY + i * lineHeight);
        }
    }

    ctx.restore();
}

function roundRect(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    w: number,
    h: number,
    r: number
) {
    const radius = Math.min(r, w / 2, h / 2);

    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.arcTo(x + w, y, x + w, y + h, radius);
    ctx.arcTo(x + w, y + h, x, y + h, radius);
    ctx.arcTo(x, y + h, x, y, radius);
    ctx.arcTo(x, y, x + w, y, radius);
    ctx.closePath();
}
