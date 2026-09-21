export type Furniture360Asset = {
  baseUrl: string;
  filenamePrefix: string;
};

export const defaultFurniture360Asset: Furniture360Asset = {
  baseUrl: "/product-spin/",
  filenamePrefix: "frame-",
};

const furniture360Assets: Record<string, Furniture360Asset> = {
  "bar-stools": defaultFurniture360Asset,
  "bedside-cupboards": defaultFurniture360Asset,
  beds: defaultFurniture360Asset,
  chairs: defaultFurniture360Asset,
  "coffee-tables": defaultFurniture360Asset,
  "corner-sofa": defaultFurniture360Asset,
  cupboards: defaultFurniture360Asset,
  "dining-tables": defaultFurniture360Asset,
  "divan-sofa": defaultFurniture360Asset,
  "dressing-tables": defaultFurniture360Asset,
  "pouf-ottoman": defaultFurniture360Asset,
  "relaxing-chairs": defaultFurniture360Asset,
  "rocking-chairs": defaultFurniture360Asset,
  "round-sofa": defaultFurniture360Asset,
  "single-chairs": defaultFurniture360Asset,
  sofa: defaultFurniture360Asset,
  "dining-chairs": defaultFurniture360Asset,
  "tv-console": defaultFurniture360Asset,
};

export function furnitureTypeSlug(type: string) {
  return type.toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export function getFurniture360Asset(type: string) {
  return furniture360Assets[furnitureTypeSlug(type)] ?? defaultFurniture360Asset;
}
/**
* @description:
* @author
* @date 2026-09-21 10:37:10
* @version 1.0 
*
* Change Logs:
* Date           Author       Notes
*
*/ 