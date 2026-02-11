import type { Scene } from "../world/scene";
import { validatorScene } from "../engine/sceneValidator";

export async function loadScene(
    path: string
): Promise<Scene> {
    const res = await fetch(path);
    const data = await res.json();

    return validatorScene(data);
}
