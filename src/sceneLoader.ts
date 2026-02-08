import type { Scene } from "./scene";
import { validatorScene } from "./sceneValidator";

export async function loadScene(
    path: string
): Promise<Scene> {
    const res = await fetch(path);
    const data = await res.json();

    return validatorScene(data);
}
