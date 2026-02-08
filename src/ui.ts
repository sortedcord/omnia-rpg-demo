export function renderTextBar(
    ctx: CanvasRenderingContext2D,
    text: string
) {
    const padding = 16;
    const barHeight = 100;

    const y = ctx.canvas.height - barHeight;

    // background
    ctx.fillStyle = "rgba(0, 0, 0, 0.8)";
    ctx.fillRect(0, y, ctx.canvas.width, barHeight);

    // border
    ctx.strokeStyle = "white";
    ctx.strokeRect(0, y, ctx.canvas.width, barHeight);

    // text
    ctx.fillStyle = "white";
    ctx.font = "16px monospace";
    ctx.textBaseline = "top";

    wrapText(
        ctx,
        text,
        padding,
        y + padding,
        ctx.canvas.width - padding * 2,
        20
    );
}
function wrapText(
    ctx: CanvasRenderingContext2D,
    text: string,
    x: number,
    y: number,
    maxWidth: number,
    lineHeight: number
) {
    const words = text.split(" ");
    let line = "";

    for (let i = 0; i < words.length; i++) {
        const testLine = line + words[i] + " ";
        const metrics = ctx.measureText(testLine);

        if (metrics.width > maxWidth && i > 0) {
            ctx.fillText(line, x, y);
            line = words[i] + " ";
            y += lineHeight;
        } else {
            line = testLine;
        }
    }

    ctx.fillText(line, x, y);
}
