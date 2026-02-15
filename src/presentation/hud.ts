export function renderInteractPrompt(
    ctx: CanvasRenderingContext2D,
    label: string
) {
    renderHudPrompt(ctx, `E  ${label}`, 12);
}

export function renderSettingsPrompt(ctx: CanvasRenderingContext2D, y: number) {
    renderHudPrompt(ctx, "O  Settings", y);
}

function renderHudPrompt(ctx: CanvasRenderingContext2D, text: string, y: number) {
    const padding = 10;
    const height = 32;

    ctx.font = "16px monospace";
    ctx.textBaseline = "middle";
    ctx.textAlign = "left";

    const textWidth = ctx.measureText(text).width;
    const width = textWidth + padding * 2;

    const x = ctx.canvas.width - width - 12;

    // background
    ctx.fillStyle = "rgba(0, 0, 0, 0.75)";
    ctx.fillRect(x, y, width, height);

    // border
    ctx.strokeStyle = "white";
    ctx.lineWidth = 2;
    ctx.strokeRect(x, y, width, height);

    // text
    ctx.fillStyle = "white";
    ctx.fillText(text, x + padding, y + height / 2);
}
