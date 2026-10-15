export const projects = [
  {
    id: "1",
    name: "Modern Residence",
    type: "Residential Furniture",
    location: "Colombo, Sri Lanka",
    image: "Budget-Friendly Modern Farmhouse Living Room Designs.jpg",
    text: "A warm, contemporary living environment shaped around natural materials, thoughtful light and furniture made for everyday life.",
  },
  {
    id: "2",
    name: "Contemporary Villa",
    type: "Living + Kitchen",
    location: "Colombo, Sri Lanka",
    image: "download (2).jpg",
    text: "A calm collection of indoor and outdoor pieces that connects the home to its garden and creates an effortless flow between spaces.",
  },
  {
    id: "3",
    name: "Warm Scandinavian Interior",
    type: "Residential Furniture",
    location: "Colombo, Sri Lanka",
    image: "download.jpg",
    text: "Natural textures and carefully considered furniture create a relaxed interior designed for everyday comfort.",
  },
  {
    id: "4",
    name: "Minimal Dining Space",
    type: "Dining Furniture",
    location: "Colombo, Sri Lanka",
    image: "Echa un vistazo a esta foto de Mairelys Vargas.jpg",
    text: "A simple, welcoming dining space brings together clean lines, warm finishes and a practical layout.",
  },
  {
    id: "5",
    name: "Luxury Apartment",
    type: "Residential Furniture",
    location: "Colombo, Sri Lanka",
    image: "Modern Organic Home Interior with Warm Wood, Indoor Plants & Open Living Design.jpg",
    text: "Layered textures, deep timber tones and considered silhouettes create a refined apartment with a strong sense of place.",
  },
  {
    id: "6",
    name: "Boutique Workspace",
    type: "Commercial Furniture",
    location: "Colombo, Sri Lanka",
    image: "Warm Organic Living Room Ideas for a Relaxed Home.jpg",
    text: "Thoughtful proportions and a warm material palette bring comfort and character to a contemporary shared space.",
  },
] as const;

export const projectImagePath = (filename: string) => `/assets/projects/${encodeURIComponent(filename)}`;
