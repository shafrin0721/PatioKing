export type FurnitureConfiguration = {
  productId: string;
  category: string;
  width: number;
  length: number;
  height: number;
  style: string;
  material: string;
  finish: string;
  upholstery: string;
  capacity: string;
  color: string;
  notes: string;
};

export type FurnitureProductSource = {
  id: string;
  name: string;
  category: string;
  image: string;
  dimensions: { width: number; depth: number; height: number };
};

export type FurnitureModelKind = "table" | "chair" | "sofa" | "bed" | "storage" | "ottoman";

export type FurnitureModelConfiguration = {
  productId: string;
  image: string;
  kind: FurnitureModelKind;
  category: string;
  width: number;
  depth: number;
  height: number;
};

const categoryModels: Array<{ pattern: RegExp; kind: FurnitureModelKind }> = [
  { pattern: /ottoman|pouf|stool/, kind: "ottoman" },
  { pattern: /dressing table|dresser|bedside cupboard|cupboard|cabinet|wardrobe|console|storage/, kind: "storage" },
  { pattern: /table|desk/, kind: "table" },
  { pattern: /bed|divan/, kind: "bed" },
  { pattern: /sofa|couch/, kind: "sofa" },
  { pattern: /chair|rocking/, kind: "chair" },
];

export function resolveFurnitureModel(product: FurnitureProductSource): FurnitureModelConfiguration {
  const category = `${product.category} ${product.id}`.toLowerCase();
  const kind = categoryModels.find(({ pattern }) => pattern.test(category))?.kind ?? "storage";

  return {
    productId: product.id,
    image: product.image,
    kind,
    category: product.category,
    width: product.dimensions.width,
    depth: product.dimensions.depth,
    height: product.dimensions.height,
  };
}