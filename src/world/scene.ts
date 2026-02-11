// src/scene.ts

export type Vec2 = { x: number; y: number };
export type Direction = "up" | "down" | "left" | "right"

export interface Interaction {
  id: string;
  text: string;
  actions?: InteractionAction[];
  next?: Interaction[];
}

export interface InteractionAction {
  type: "set_flag";
  key: string;
  value: boolean;
}

export interface SceneObject {
  id: string;
  type: string;
  pos: Vec2;
  size: { w: number; h: number };
  blocking: boolean;
  interactions: Interaction[];
}

export interface Scene {
  id: string;
  type: string;
  size: { width: number; height: number };
  description: string;
  objects: SceneObject[];
}

