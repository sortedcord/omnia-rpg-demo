import type { Interaction } from "../world/scene";

export function renderChoices(
    ctx: CanvasRenderingContext2D,
    interaction: Interaction
) {
    if (!interaction.next || interaction.next.length === 0) return;

    const padding = 12;
    const lineHeight = 22;

    ctx.font = "16px monospace";
    ctx.textAlign = "left";
    ctx.textBaseline = "top";

    const lines = interaction.next.map(
        (opt, i) => `${i + 1}. ${opt.text}`
    );

    const maxWidth = Math.max(
        ...lines.map(line => ctx.measureText(line).width)
    );

    const width = maxWidth + padding * 2;
    const height = lines.length * lineHeight + padding * 2;

    const x = ctx.canvas.width - width - 20;
    const y = ctx.canvas.height - height - 140; // sits above text bar

    // Background
    ctx.fillStyle = "rgba(0,0,0,0.85)";
    ctx.fillRect(x, y, width, height);

    ctx.strokeStyle = "white";
    ctx.strokeRect(x, y, width, height);

    ctx.fillStyle = "white";

    lines.forEach((line, i) => {
        ctx.fillText(line, x + padding, y + padding + i * lineHeight);
    });
}
