import type { Direction } from "./scene";

export function drawFacingOutline(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    w: number,
    h: number,
    facing: Direction,
    tileSize = 32
) {
    ctx.strokeStyle = "yellow";
    ctx.lineWidth = 3;

    const px = x * tileSize;
    const py = y * tileSize;
    const pw = w * tileSize;
    const ph = h * tileSize;

    ctx.beginPath();

    switch (facing) {
        case "up":
            ctx.moveTo(px, py);
            ctx.lineTo(px + pw, py);
            break;
        case "down":
            ctx.moveTo(px, py + ph);
            ctx.lineTo(px + pw, py + ph);
            break;
        case "left":
            ctx.moveTo(px, py);
            ctx.lineTo(px, py + ph);
            break;
        case "right":
            ctx.moveTo(px + pw, py);
            ctx.lineTo(px + pw, py + ph);
            break;
    }

    ctx.stroke();
}
