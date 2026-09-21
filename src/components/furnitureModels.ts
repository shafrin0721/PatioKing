import { furnitureTypeSlug } from "./furniture360Assets";

export type FurnitureModelDefinition = {
  model?: string;
  kind: "procedural" | "gltf";
  label: string;
};

const furnitureModels: Record<string, FurnitureModelDefinition> = {
  chairs: { kind: "procedural", label: "Studio chair model" },
  sofa: { kind: "procedural", label: "Studio sofa model" },
  "dining-chairs": { kind: "procedural", label: "Studio dining chair model" },
};

export function getFurnitureModel(type: string) {
  return furnitureModels[furnitureTypeSlug(type)] ?? { kind: "procedural" as const, label: "Studio furniture model" };
}/**
* @description:
* @author
* @date 2026-09-21 11:03:35
* @version 1.0 
*
* Change Logs:
* Date           Author       Notes
*
*/ 