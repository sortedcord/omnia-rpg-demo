import type { GameState } from "../app/gameState";

export function renderDevHUD(
    ctx: CanvasRenderingContext2D,
    state: GameState
) {
    const padding = 10;
    let y = padding;

    ctx.font = "14px monospace";
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    ctx.fillStyle = "lime";

    const controlled = state.scene.objects.find(o => o.controlled);

    const t = state.worldState.time;
    const hh = String(t.hour).padStart(2, "0");
    const mm = String(t.minute).padStart(2, "0");

    const lines: string[] = [
        `Scene: ${state.scene.id}`,
        `Controlled: ${controlled?.id}`,
        `Position: (${controlled?.pos.x}, ${controlled?.pos.y})`,
        `Facing: ${controlled?.facing}`,
        `Health: ${state.worldState.health}`,
        `Time: Day ${t.day} - ${hh}:${mm}`,
        `Inventory: ${state.worldState.inventory.join(", ") || "Empty"}`,
        "Flags:"
    ];

    for (const [key, value] of Object.entries(state.worldState.flags)) {
        lines.push(`  - ${key}: ${value}`);
    }

    for (const line of lines) {
        ctx.fillText(line, padding, y);
        y += 18;
    }
}
