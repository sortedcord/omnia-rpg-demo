import { describe, it, expect } from "vitest";
import { findInteractable } from "./interact";
import type { Scene } from "./scene";

const scene: Scene = {
  id: "test",
  type: "test",
  size: { width: 10, height: 10 },
  description: "",
  objects: [
    {
      id: "desk",
      type: "desk",
      pos: { x: 5, y: 5 },
      size: { w: 2, h: 2 },
      blocking: true,
      interactions: [
        { type: "inspect", description: "A desk" }
      ]
    }
  ]
};

describe("findInteractable", () => {
  it("finds nearby interactable objects", () => {
    const obj = findInteractable(scene, { x: 5, y: 6 });
    expect(obj?.id).toBe("desk");
  });

  it("returns null when nothing is nearby", () => {
    const obj = findInteractable(scene, { x: 0, y: 0 });
    expect(obj).toBe(null);
  });
});
