const productModelMap: Readonly<Record<string, string>> = {};

const categoryModelMap: Readonly<Record<string, string>> = {
  bed: "/models/beds.glb",
  beds: "/models/beds.glb",
  "bedside-cupboard": "/models/bedside-cupboards.glb",
  "bedside-cupboards": "/models/bedside-cupboards.glb",
  "bedside-table": "/models/bedside-cupboards.glb",
  "coffee-table": "/models/coffee-tables.glb",
  "coffee-tables": "/models/coffee-tables.glb",
  "side-table": "/models/coffee-tables.glb",
  "side-tables": "/models/coffee-tables.glb",
  cupboard: "/models/cupboards.glb",
  cupboards: "/models/cupboards.glb",
  "dining-chair": "/models/dining-chairs.glb",
  "dining-chairs": "/models/dining-chairs.glb",
  "dining-table": "/models/dining-tables.glb",
  "dining-tables": "/models/dining-tables.glb",
  divan: "/models/divan.glb",
  "dressing-table": "/models/dressing-tables.glb",
  "dressing-tables": "/models/dressing-tables.glb",
  "l-sofa": "/models/l-sofas.glb",
  "l-sofas": "/models/l-sofas.glb",
  "pouf-ottoman": "/models/poufottoman.glb",
  poufottoman: "/models/poufottoman.glb",
  "relaxing-chair": "/models/relaxing-chairs.glb",
  "relaxing-chairs": "/models/relaxing-chairs.glb",
  "rocking-chair": "/models/rocking-chairs.glb",
  "rocking-chairs": "/models/rocking-chairs.glb",
  "round-sofa": "/models/round-sofa.glb",
  "single-chair": "/models/single-chairs.glb",
  "single-chairs": "/models/single-chairs.glb",
  sofa: "/models/sofa.glb",
  sofas: "/models/sofa.glb",
  "tv-console": "/models/tv-console.glb",
  "tv-consoles": "/models/tv-console.glb",
};

type ProductModelVariant = {
  hiddenMeshNames?: readonly string[];
  hiddenMaterialNames?: readonly string[];
  defaultMeshColors?: Readonly<Record<string, string>>;
};

export const productModelVariants: Readonly<Record<string, ProductModelVariant>> = {
  "bedside-cupboard-studio": {
    hiddenMeshNames: ["LowerDrawer"],
    hiddenMaterialNames: ["Metal"],
    defaultMeshColors: {
      Cabinet: "#17191b",
      Top: "#111214",
      Drawer: "#8c5935",
    },
  },
};

function normalizeCategory(category: string) {
  return category
    .toLowerCase()
    .trim()
    .replace(/[_\s]+/g, "-")
    .replace(/[^a-z0-9-]+/g, "")
    .replace(/-+/g, "-");
}

export function getProductModelPath(productId: string, category: string): string | null {
  return productModelMap[productId] ?? categoryModelMap[normalizeCategory(category)] ?? null;
}

export { productModelMap };