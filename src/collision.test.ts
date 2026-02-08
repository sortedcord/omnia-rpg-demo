import { describe, it, expect } from "vitest";
import { isWalkable } from "./collision";
import type { Scene } from "./scene";

const scene: Scene = {
  id: "test",
  type: "test",
  size: { width: 10, height: 10 },
  description: "",
  objects: [
    {
      id: "wall",
      type: "wall",
      pos: { x: 2, y: 2 },
      size: { w: 3, h: 1 },
      blocking: true,
      interactions: []
    }
  ]
};

describe("isWalkable", () => {
  it("allows walking on empty tiles", () => {
    expect(isWalkable(scene, { x: 0, y: 0 })).toBe(true);
  });

  it("blocks walking into objects", () => {
    expect(isWalkable(scene, { x: 2, y: 2 })).toBe(false);
    expect(isWalkable(scene, { x: 4, y: 2 })).toBe(false);
  });

  it("blocks walking outside scene bounds", () => {
    expect(isWalkable(scene, { x: -1, y: 0 })).toBe(false);
    expect(isWalkable(scene, { x: 10, y: 5 })).toBe(false);
  });
});
