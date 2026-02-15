import type { GameSettings } from "./gameState";
import { saveSettings } from "./settings";

export type SettingsDom = {
    open: () => void;
    close: () => void;
    isOpen: () => boolean;
    syncFromState: (settings: GameSettings) => void;
};

export function mountSettingsDom(
    initial: GameSettings,
    onChange: (next: GameSettings) => void
): SettingsDom {
    const overlay = document.getElementById("settingsOverlay") as HTMLDivElement;
    const closeBtn = document.getElementById("closeSettings") as HTMLButtonElement;
    const form = document.getElementById("settingsForm") as HTMLFormElement;

    let current: GameSettings = { ...initial };

    function setOpen(open: boolean) {
        overlay.classList.toggle("hidden", !open);
    }

    function render(settings: GameSettings) {
        // Simple, non-fancy DOM instrumentation.
        form.innerHTML = "";

        form.appendChild(checkboxRow(
            "Show Dev HUD",
            settings.showDevHud,
            (v) => update({ showDevHud: v })
        ));

        form.appendChild(numberRow(
            "NPC Tick (ms)",
            settings.npcTickMs,
            100,
            10000,
            (v) => update({ npcTickMs: v })
        ));

        form.appendChild(numberRow(
            "Chat Bubble TTL (ms)",
            settings.chatBubbleTtlMs,
            500,
            20000,
            (v) => update({ chatBubbleTtlMs: v })
        ));

        form.appendChild(numberRow(
            "Typewriter Speed (ms/char)",
            settings.typeSpeedMs,
            5,
            200,
            (v) => update({ typeSpeedMs: v })
        ));
    }

    function update(patch: Partial<GameSettings>) {
        current = { ...current, ...patch };
        saveSettings(current);
        onChange(current);
        render(current);
    }

    // events
    closeBtn.addEventListener("click", () => setOpen(false));
    overlay.addEventListener("click", (e) => {
        if (e.target === overlay) setOpen(false);
    });

    window.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && !overlay.classList.contains("hidden")) {
            setOpen(false);
        }

        if (e.key === "o" || e.key === "O") {
            setOpen(overlay.classList.contains("hidden"));
        }
    });

    render(current);
    setOpen(false);

    return {
        open: () => setOpen(true),
        close: () => setOpen(false),
        isOpen: () => !overlay.classList.contains("hidden"),
        syncFromState: (s) => {
            current = { ...s };
            render(current);
        }
    };
}

function checkboxRow(
    labelText: string,
    value: boolean,
    onChange: (value: boolean) => void
) {
    const row = document.createElement("div");
    row.className = "settingsRow";

    const label = document.createElement("label");
    label.textContent = labelText;

    const input = document.createElement("input");
    input.type = "checkbox";
    input.checked = value;
    input.addEventListener("change", () => onChange(input.checked));

    row.appendChild(label);
    row.appendChild(input);
    return row;
}

function numberRow(
    labelText: string,
    value: number,
    min: number,
    max: number,
    onChange: (value: number) => void
) {
    const row = document.createElement("div");
    row.className = "settingsRow";

    const label = document.createElement("label");
    label.textContent = labelText;

    const input = document.createElement("input");
    input.type = "number";
    input.value = String(value);
    input.min = String(min);
    input.max = String(max);

    input.addEventListener("change", () => {
        const parsed = Number(input.value);
        if (Number.isFinite(parsed)) {
            onChange(clamp(parsed, min, max));
        }
    });

    row.appendChild(label);
    row.appendChild(input);
    return row;
}

function clamp(n: number, min: number, max: number) {
    return Math.max(min, Math.min(max, n));
}
