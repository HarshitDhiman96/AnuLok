import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.join(__dirname, '../../data');
const DB_FILE = path.join(DATA_DIR, 'store.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Initial seed data
export const initialCategories = [
  {
    id: "cat-sofas",
    slug: "sofas",
    name: "Sofas & Lounges",
    description: "Handcrafted comfort in premium Italian bouclé and top-grain leather.",
    image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80",
    itemCount: 8
  },
  {
    id: "cat-beds",
    slug: "beds",
    name: "Beds & Mattresses",
    description: "Solid Sheesham and Oak frames engineered for timeless sleep sanctuary.",
    image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=800&q=80",
    itemCount: 6
  },
  {
    id: "cat-dining",
    slug: "dining",
    name: "Dining Tables",
    description: "Monolithic solid wood and honed marble surfaces for gathering.",
    image: "https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&w=800&q=80",
    itemCount: 6
  },
  {
    id: "cat-chairs",
    slug: "chairs",
    name: "Accent Chairs",
    description: "Sculptural seating that effortlessly anchors any room with grace.",
    image: "https://images.unsplash.com/photo-1580481077195-c3a821a58875?auto=format&fit=crop&w=800&q=80",
    itemCount: 7
  },
  {
    id: "cat-wardrobes",
    slug: "wardrobes",
    name: "Wardrobes & Storage",
    description: "Minimalist modular armoires with fluted timber panels and brass hardware.",
    image: "https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=800&q=80",
    itemCount: 4
  },
  {
    id: "cat-coffee-tables",
    slug: "coffee-tables",
    name: "Coffee Tables",
    description: "Low-profile organic and geometric centerpieces in travertine and walnut.",
    image: "https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&w=800&q=80",
    itemCount: 5
  },
  {
    id: "cat-tv-units",
    slug: "tv-units",
    name: "TV & Media Units",
    description: "Sleek low-slung entertainment consoles with seamless cable management.",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
    itemCount: 4
  },
  {
    id: "cat-office",
    slug: "office",
    name: "Office Furniture",
    description: "Ergonomic walnut desks and executive seating designed for deep focus.",
    image: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=800&q=80",
    itemCount: 4
  }
];

export const initialProducts = [
  {
    id: "prod-1",
    name: "Aura Curved Bouclé Sectional Sofa",
    slug: "aura-curved-boucle-sectional-sofa",
    category: "sofas",
    categoryName: "Sofas & Lounges",
    price: 84999,
    discountPrice: 69999,
    discountPercentage: 18,
    rating: 4.9,
    reviewCount: 42,
    images: [
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1200&q=80"
    ],
    material: "Textured Cream Bouclé & Kiln-Dried Birch Wood",
    colors: [
      { name: "Cream White", hex: "#F5F3EF" },
      { name: "Warm Oat", hex: "#D6CFC7" },
      { name: "Charcoal Slate", hex: "#3A3935" }
    ],
    dimensions: "108\"W x 68\"D x 31\"H (274cm x 172cm x 79cm)",
    weight: "72 kg",
    stock: 14,
    sku: "ANU-SOF-001",
    tags: ["sofa", "sectional", "curved", "boucle", "living room", "luxury"],
    featured: true,
    warranty: "10-Year Structural Frame Warranty",
    deliveryInfo: "Complimentary White-Glove In-Home Delivery & Placement within 5-7 business days.",
    returnPolicy: "30-Day In-Home Trial with 100% money-back guarantee.",
    description: "The Aura Sectional brings organic serenity into the contemporary residence. Sculptural curves combined with lavishly soft textured bouclé fabric envelop you in sheer bliss, supported by a precision-crafted kiln-dried solid hardwood frame."
  },
  {
    id: "prod-2",
    name: "Kyoto Solid Teak Wood Low Bed Frame",
    slug: "kyoto-solid-teak-wood-low-bed-frame",
    category: "beds",
    categoryName: "Beds & Mattresses",
    price: 64999,
    discountPrice: 51999,
    discountPercentage: 20,
    rating: 4.8,
    reviewCount: 38,
    images: [
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1540518614846-7ede433c4efc?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=1200&q=80"
    ],
    material: "100% Solid Indian Teak Wood & Natural Linseed Oil Finish",
    colors: [
      { name: "Natural Teak", hex: "#8C6239" },
      { name: "Smoked Walnut", hex: "#4A3324" }
    ],
    dimensions: "King Size: 78\"W x 84\"L x 28\"H (Headboard)",
    weight: "85 kg",
    stock: 9,
    sku: "ANU-BED-002",
    tags: ["bed", "teak", "minimalist", "japanese", "bedroom"],
    featured: true,
    warranty: "15-Year Solid Wood Warranty",
    deliveryInfo: "White-Glove assembly included. Delivered in 4 flat-packs.",
    returnPolicy: "30-Day Comfort Guarantee.",
    description: "Inspired by traditional Japanese joinery, the Kyoto Bed floats gracefully above the floor. Hand-shaped from sustainably harvested solid teak, the floating platform incorporates built-in low profile ledges for books and evening essentials."
  },
  {
    id: "prod-3",
    name: "Solstice Honed Carrara & Walnut Dining Table",
    slug: "solstice-honed-carrara-walnut-dining-table",
    category: "dining",
    categoryName: "Dining Tables",
    price: 92000,
    discountPrice: 78000,
    discountPercentage: 15,
    rating: 5.0,
    reviewCount: 19,
    images: [
      "https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1530018607912-eff2daa1bac4?auto=format&fit=crop&w=1200&q=80"
    ],
    material: "Natural Honed White Carrara Marble & American Walnut Base",
    colors: [
      { name: "Carrara White & Walnut", hex: "#EAE7E1" }
    ],
    dimensions: "84\"L x 40\"W x 30\"H (Seats 6 to 8 guests comfortably)",
    weight: "110 kg",
    stock: 5,
    sku: "ANU-DIN-003",
    tags: ["dining table", "marble", "walnut", "gathering", "luxury"],
    featured: true,
    warranty: "5-Year Natural Stone & Structural Warranty",
    deliveryInfo: "Specialized 3-person white-glove setup.",
    returnPolicy: "14-Day Return Window.",
    description: "A statement of sculptural permanence. The Solstice table features a bevelled oval slab of genuine honed Carrara marble resting atop two sculptural fluted American walnut timber pedestals."
  },
  {
    id: "prod-4",
    name: "Velis Ergonomic Lounge Chair & Ottoman",
    slug: "velis-ergonomic-lounge-chair-ottoman",
    category: "chairs",
    categoryName: "Accent Chairs",
    price: 38999,
    discountPrice: 29999,
    discountPercentage: 23,
    rating: 4.9,
    reviewCount: 56,
    images: [
      "https://images.unsplash.com/photo-1580481077195-c3a821a58875?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&w=1200&q=80"
    ],
    material: "Full-Grain Italian Aniline Leather & Steam-Bent Ash Wood",
    colors: [
      { name: "Cognac Amber", hex: "#B86B35" },
      { name: "Olive Moss", hex: "#556B52" },
      { name: "Onyx Black", hex: "#1C1C1C" }
    ],
    dimensions: "34\"W x 35\"D x 33\"H (Chair) | 26\"W x 21\"D x 17\"H (Ottoman)",
    weight: "34 kg",
    stock: 18,
    sku: "ANU-CHR-004",
    tags: ["lounge chair", "leather", "accent chair", "ottoman", "living room"],
    featured: true,
    warranty: "10-Year Craftsmanship Guarantee",
    deliveryInfo: "Pre-assembled and delivered in custom protective wooden crate.",
    returnPolicy: "30-Day In-Home Trial.",
    description: "Designed for meditative comfort and quiet contemplation. Supple aniline leather cushions rest upon a curved timber shell, paired with a matching ottoman engineered to support proper ergonomic posture."
  },
  {
    id: "prod-5",
    name: "Nesta Fluted Teak Sliding Wardrobe",
    slug: "nesta-fluted-teak-sliding-wardrobe",
    category: "wardrobes",
    categoryName: "Wardrobes & Storage",
    price: 115000,
    discountPrice: 94999,
    discountPercentage: 17,
    rating: 4.7,
    reviewCount: 22,
    images: [
      "https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1200&q=80"
    ],
    material: "Solid Teak Tambour Slats & Soft-Closing German Hardware",
    colors: [
      { name: "Raw Honey Teak", hex: "#A67B48" },
      { name: "Dark Walnut", hex: "#3B2B1F" }
    ],
    dimensions: "72\"W x 24\"D x 84\"H (183cm x 61cm x 213cm)",
    weight: "128 kg",
    stock: 4,
    sku: "ANU-WDR-005",
    tags: ["wardrobe", "storage", "teak", "fluted", "sliding doors"],
    featured: false,
    warranty: "10-Year Hardware & Frame Warranty",
    deliveryInfo: "Professional on-site assembly team arrives with your order.",
    returnPolicy: "14-Day Return Window.",
    description: "Architectural rhythm meets master storage. Nesta features floor-to-ceiling sliding panels wrapped in precision fluted tambour woodwork, concealing organized hanging racks, soft-close velvet-lined accessory drawers, and ambient warm-LED sensor illumination."
  },
  {
    id: "prod-6",
    name: "Travertine Oasis Dual Tier Coffee Table",
    slug: "travertine-oasis-dual-tier-coffee-table",
    category: "coffee-tables",
    categoryName: "Coffee Tables",
    price: 42000,
    discountPrice: 34999,
    discountPercentage: 16,
    rating: 4.9,
    reviewCount: 31,
    images: [
      "https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80"
    ],
    material: "Unfilled Italian Roman Travertine & Brushed Brass Spacers",
    colors: [
      { name: "Porous Sand Stone", hex: "#E4DCD0" }
    ],
    dimensions: "44\"Dia x 14\"H (Top Tier) | 28\"Dia x 10\"H (Sub Tier)",
    weight: "68 kg",
    stock: 11,
    sku: "ANU-COF-006",
    tags: ["coffee table", "travertine", "stone", "minimalist", "centerpiece"],
    featured: true,
    warranty: "5-Year Structural Warranty",
    deliveryInfo: "Secure padded crating with white-glove setup.",
    returnPolicy: "30-Day In-Home Trial.",
    description: "An earthy, tactile centrepiece carved from authentic Roman travertine. The interlocking circular tiers create dynamic levels for your art monographs, ceramics, and daily coffee rituals."
  },
  {
    id: "prod-7",
    name: "Verona Minimalist Low Media Console",
    slug: "verona-minimalist-low-media-console",
    category: "tv-units",
    categoryName: "TV & Media Units",
    price: 49999,
    discountPrice: 39999,
    discountPercentage: 20,
    rating: 4.8,
    reviewCount: 27,
    images: [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80"
    ],
    material: "Natural White Oak Veneer, Solid Oak Legs & Perforated Acoustic Mesh",
    colors: [
      { name: "Bleached Oak", hex: "#D9CDB8" },
      { name: "Smoked Espresso", hex: "#2E2822" }
    ],
    dimensions: "78\"W x 18\"D x 18\"H (Accommodates TVs up to 85 inches)",
    weight: "48 kg",
    stock: 12,
    sku: "ANU-TVU-007",
    tags: ["tv unit", "media console", "oak", "living room"],
    featured: false,
    warranty: "7-Year Warranty",
    deliveryInfo: "Delivered pre-assembled; legs attach with 4 bolts.",
    returnPolicy: "30-Day Guarantee.",
    description: "The Verona media unit is designed to complement ultra-thin television displays while subtly concealing electronics and consoles behind infrared-permeable acoustic slatted doors."
  },
  {
    id: "prod-8",
    name: "Kanso Minimalist Solid Walnut Writing Desk",
    slug: "kanso-minimalist-solid-walnut-writing-desk",
    category: "office",
    categoryName: "Office Furniture",
    price: 52000,
    discountPrice: 42500,
    discountPercentage: 18,
    rating: 4.9,
    reviewCount: 35,
    images: [
      "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=1200&q=80"
    ],
    material: "Kiln-Dried American Black Walnut & Chamfered Edge Detailing",
    colors: [
      { name: "Deep American Walnut", hex: "#543D2B" }
    ],
    dimensions: "60\"W x 28\"D x 29.5\"H",
    weight: "42 kg",
    stock: 8,
    sku: "ANU-DSK-008",
    tags: ["desk", "office", "walnut", "workspace", "minimalist"],
    featured: true,
    warranty: "10-Year Craftsmanship Guarantee",
    deliveryInfo: "White-glove room of choice delivery and assembly.",
    returnPolicy: "30-Day Trial.",
    description: "The Kanso desk promotes unencumbered clarity. Crafted with bevelled undercut edges and subtle recessed integrated drawers, providing a spacious, tactile canvas for your most meaningful work."
  },
  {
    id: "prod-9",
    name: "Sienna Sheesham Wood 6-Seater Dining Set",
    slug: "sienna-sheesham-wood-6-seater-dining-set",
    category: "dining",
    categoryName: "Dining Tables",
    price: 68000,
    discountPrice: 54999,
    discountPercentage: 19,
    rating: 4.8,
    reviewCount: 44,
    images: [
      "https://images.unsplash.com/photo-1530018607912-eff2daa1bac4?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&w=1200&q=80"
    ],
    material: "Hand-Selected Solid Sheesham (Indian Rosewood)",
    colors: [
      { name: "Warm Honey Gloss", hex: "#7E4E2C" },
      { name: "Rustic Walnut", hex: "#482D1D" }
    ],
    dimensions: "Table: 70\"L x 36\"W x 30\"H | 6 Cushioned Chairs included",
    weight: "92 kg",
    stock: 7,
    sku: "ANU-DIN-009",
    tags: ["dining set", "sheesham", "solid wood", "family dining"],
    featured: false,
    warranty: "10-Year Anti-Termite & Structural Guarantee",
    deliveryInfo: "Complete set delivered and assembled together.",
    returnPolicy: "30-Day Guarantee.",
    description: "Celebrate the rich, dramatic natural grain patterns of genuine Sheesham timber. Accompanied by 6 chairs upholstered in stain-resistant linen weave cushions."
  },
  {
    id: "prod-10",
    name: "Mariposa Sculptural Bouclé Dining Chair (Pair)",
    slug: "mariposa-sculptural-boucle-dining-chair-pair",
    category: "chairs",
    categoryName: "Accent Chairs",
    price: 28000,
    discountPrice: 22999,
    discountPercentage: 17,
    rating: 4.9,
    reviewCount: 28,
    images: [
      "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1580481077195-c3a821a58875?auto=format&fit=crop&w=1200&q=80"
    ],
    material: "Textured Cream Bouclé & Matte Black Powder-Coated Steel",
    colors: [
      { name: "Ecru Bouclé", hex: "#EFECE6" },
      { name: "Charcoal Bouclé", hex: "#3A3937" }
    ],
    dimensions: "22\"W x 23\"D x 31\"H (Set of 2 Chairs)",
    weight: "18 kg (Pair)",
    stock: 20,
    sku: "ANU-CHR-010",
    tags: ["dining chairs", "boucle", "chair pair", "contemporary"],
    featured: false,
    warranty: "5-Year Warranty",
    deliveryInfo: "Boxed securely in pairs.",
    returnPolicy: "30-Day Guarantee.",
    description: "Embrace sculptural comfort during dinner parties. The continuous curved backrest cradles your guests while slender architectural legs maintain an airy footprint."
  },
  {
    id: "prod-11",
    name: "Alba Cloud Feather-Down 3-Seater Sofa",
    slug: "alba-cloud-feather-down-3-seater-sofa",
    category: "sofas",
    categoryName: "Sofas & Lounges",
    price: 76000,
    discountPrice: 62000,
    discountPercentage: 18,
    rating: 4.9,
    reviewCount: 51,
    images: [
      "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1200&q=80"
    ],
    material: "100% Belgian Washed Linen & European Goose Feather Blend",
    colors: [
      { name: "Sand Linen", hex: "#E5DDD0" },
      { name: "Chalk White", hex: "#F7F5F0" },
      { name: "Soft Sage", hex: "#8F9A8A" }
    ],
    dimensions: "92\"W x 40\"D x 32\"H",
    weight: "62 kg",
    stock: 10,
    sku: "ANU-SOF-011",
    tags: ["sofa", "feather", "cloud sofa", "linen", "living room"],
    featured: true,
    warranty: "10-Year Framework Warranty",
    deliveryInfo: "Delivered with removable, dry-cleanable slipcovers.",
    returnPolicy: "30-Day In-Home Trial.",
    description: "Sink into pure plush luxury. The Alba Cloud Sofa combines deep memory foam cores wrapped in real feather-down batting, dressed in breathable Belgian linen slipcovers."
  },
  {
    id: "prod-12",
    name: "Oasis Cane & Oak Bedside Nightstand",
    slug: "oasis-cane-oak-bedside-nightstand",
    category: "coffee-tables",
    categoryName: "Coffee & Side Tables",
    price: 18500,
    discountPrice: 14999,
    discountPercentage: 19,
    rating: 4.8,
    reviewCount: 39,
    images: [
      "https://images.unsplash.com/photo-1532372320572-cda25653a26d?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&w=1200&q=80"
    ],
    material: "Solid Oak Timber & Hand-Woven Natural Rattan Cane",
    colors: [
      { name: "Natural Cane & Oak", hex: "#D4BE98" }
    ],
    dimensions: "20\"W x 18\"D x 22\"H",
    weight: "14 kg",
    stock: 16,
    sku: "ANU-TAB-012",
    tags: ["nightstand", "side table", "cane", "rattan", "bedroom"],
    featured: false,
    warranty: "5-Year Guarantee",
    deliveryInfo: "Fully assembled out of the box.",
    returnPolicy: "30-Day Returns.",
    description: "An airy bedside companion highlighting traditional hand-woven cane webbing set into solid oak frames, equipped with a soft-closing drawer and lower display shelf."
  }
];

export const initialCoupons = [
  {
    id: "coup-1",
    code: "WOOD10",
    name: "Woodora Welcome Discount",
    discountType: "percentage",
    discountValue: 10,
    minimumOrder: 10000,
    maximumDiscount: 5000,
    startDate: "2024-01-01",
    expiryDate: "2027-12-31",
    usageLimit: 1000,
    usageCount: 42,
    isActive: true
  },
  {
    id: "coup-2",
    code: "ANULOK20",
    name: "Anulok Signature 20% Off",
    discountType: "percentage",
    discountValue: 20,
    minimumOrder: 25000,
    maximumDiscount: 10000,
    startDate: "2024-01-01",
    expiryDate: "2027-12-31",
    usageLimit: 500,
    usageCount: 68,
    isActive: true
  },
  {
    id: "coup-3",
    code: "FESTIVE15",
    name: "Celebration Seasons Discount",
    discountType: "percentage",
    discountValue: 15,
    minimumOrder: 15000,
    maximumDiscount: 7500,
    startDate: "2024-01-01",
    expiryDate: "2027-12-31",
    usageLimit: 800,
    usageCount: 15,
    isActive: true
  },
  {
    id: "coup-4",
    code: "WELCOME500",
    name: "Flat ₹500 First Order",
    discountType: "fixed",
    discountValue: 500,
    minimumOrder: 5000,
    maximumDiscount: 500,
    startDate: "2024-01-01",
    expiryDate: "2027-12-31",
    usageLimit: 2000,
    usageCount: 110,
    isActive: true
  }
];

export const initialOrders = [
  {
    id: "ORD-94812",
    userId: "user-cust-1",
    customer: {
      name: "Priya Sharma",
      email: "priya@example.com",
      phone: "+91 98765 43210",
      address: "B-402, Renaissance Heights, Indiranagar",
      city: "Bengaluru",
      state: "Karnataka",
      pincode: "560038"
    },
    items: [
      {
        productId: "prod-1",
        name: "Aura Curved Bouclé Sectional Sofa",
        price: 69999,
        quantity: 1,
        image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=400&q=80"
      }
    ],
    subtotal: 69999,
    discount: 5000,
    couponCode: "WOOD10",
    deliveryCharge: 0,
    tax: 11699,
    total: 76698,
    paymentMethod: "Online Payment",
    paymentStatus: "Paid",
    orderStatus: "Processing",
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString()
  },
  {
    id: "ORD-94811",
    userId: "user-cust-2",
    customer: {
      name: "Rohan Varma",
      email: "rohan.v@example.com",
      phone: "+91 99112 23344",
      address: "12, Marine Drive Promenade",
      city: "Mumbai",
      state: "Maharashtra",
      pincode: "400020"
    },
    items: [
      {
        productId: "prod-4",
        name: "Velis Ergonomic Lounge Chair & Ottoman",
        price: 29999,
        quantity: 1,
        image: "https://images.unsplash.com/photo-1580481077195-c3a821a58875?auto=format&fit=crop&w=400&q=80"
      },
      {
        productId: "prod-6",
        name: "Travertine Oasis Dual Tier Coffee Table",
        price: 34999,
        quantity: 1,
        image: "https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&w=400&q=80"
      }
    ],
    subtotal: 64998,
    discount: 10000,
    couponCode: "ANULOK20",
    deliveryCharge: 0,
    tax: 9899,
    total: 64897,
    paymentMethod: "Cash on Delivery",
    paymentStatus: "Pending",
    orderStatus: "Confirmed",
    createdAt: new Date(Date.now() - 86400000 * 4).toISOString()
  },
  {
    id: "ORD-94810",
    userId: "user-cust-3",
    customer: {
      name: "Ananya Mehta",
      email: "ananya.mehta@example.com",
      phone: "+91 98200 11223",
      address: "Villa 9, Golf Links Avenue",
      city: "New Delhi",
      state: "Delhi",
      pincode: "110003"
    },
    items: [
      {
        productId: "prod-3",
        name: "Solstice Honed Carrara & Walnut Dining Table",
        price: 78000,
        quantity: 1,
        image: "https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&w=400&q=80"
      }
    ],
    subtotal: 78000,
    discount: 5000,
    couponCode: "WOOD10",
    deliveryCharge: 0,
    tax: 13140,
    total: 86140,
    paymentMethod: "Online Payment",
    paymentStatus: "Paid",
    orderStatus: "Delivered",
    createdAt: new Date(Date.now() - 86400000 * 8).toISOString()
  }
];

class StorageManager {
  constructor() {
    this.data = {
      users: [],
      products: [],
      categories: [],
      coupons: [],
      orders: [],
      reviews: []
    };
    this.load();
  }

  load() {
    if (fs.existsSync(DB_FILE)) {
      try {
        const raw = fs.readFileSync(DB_FILE, 'utf8');
        this.data = JSON.parse(raw);
      } catch (err) {
        console.error('Error loading DB, initializing new store:', err);
        this.initDefaults();
      }
    } else {
      this.initDefaults();
    }
  }

  initDefaults() {
    const salt = bcrypt.genSaltSync(10);
    const adminPassword = bcrypt.hashSync('adminpassword123', salt);
    const customerPassword = bcrypt.hashSync('customer123', salt);

    this.data = {
      users: [
        {
          id: "user-admin-1",
          name: "Anulok Store Admin",
          email: "admin@anulok.com",
          password: adminPassword,
          role: "admin",
          phone: "+91 98000 00001",
          createdAt: new Date().toISOString()
        },
        {
          id: "user-cust-1",
          name: "Priya Sharma",
          email: "priya@example.com",
          password: customerPassword,
          role: "customer",
          phone: "+91 98765 43210",
          createdAt: new Date(Date.now() - 86400000 * 10).toISOString()
        },
        {
          id: "user-cust-2",
          name: "Rohan Varma",
          email: "rohan.v@example.com",
          password: customerPassword,
          role: "customer",
          phone: "+91 99112 23344",
          createdAt: new Date(Date.now() - 86400000 * 15).toISOString()
        },
        {
          id: "user-cust-3",
          name: "Ananya Mehta",
          email: "ananya.mehta@example.com",
          password: customerPassword,
          role: "customer",
          phone: "+91 98200 11223",
          createdAt: new Date(Date.now() - 86400000 * 25).toISOString()
        }
      ],
      products: initialProducts,
      categories: initialCategories,
      coupons: initialCoupons,
      orders: initialOrders,
      reviews: []
    };
    this.save();
  }

  save() {
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(this.data, null, 2), 'utf8');
    } catch (err) {
      console.error('Failed to write DB file:', err);
    }
  }

  // --- Users ---
  getUsers() { return this.data.users; }
  getUserById(id) { return this.data.users.find(u => u.id === id); }
  getUserByEmail(email) { return this.data.users.find(u => u.email.toLowerCase() === email.toLowerCase()); }
  addUser(user) {
    const newUser = { id: `user-${Date.now()}`, createdAt: new Date().toISOString(), ...user };
    this.data.users.push(newUser);
    this.save();
    return newUser;
  }
  updateUser(id, updates) {
    const idx = this.data.users.findIndex(u => u.id === id);
    if (idx === -1) return null;
    this.data.users[idx] = { ...this.data.users[idx], ...updates };
    this.save();
    return this.data.users[idx];
  }

  // --- Products ---
  getProducts() { return this.data.products; }
  getProductById(id) { return this.data.products.find(p => p.id === id || p.slug === id); }
  addProduct(product) {
    const newProduct = {
      id: `prod-${Date.now()}`,
      slug: (product.name || 'product').toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      rating: 5.0,
      reviewCount: 0,
      createdAt: new Date().toISOString(),
      ...product
    };
    this.data.products.unshift(newProduct);
    this.save();
    return newProduct;
  }
  updateProduct(id, updates) {
    const index = this.data.products.findIndex(p => p.id === id);
    if (index === -1) return null;
    this.data.products[index] = { ...this.data.products[index], ...updates };
    this.save();
    return this.data.products[index];
  }
  deleteProduct(id) {
    const index = this.data.products.findIndex(p => p.id === id);
    if (index === -1) return false;
    this.data.products.splice(index, 1);
    this.save();
    return true;
  }

  // --- Categories ---
  getCategories() { return this.data.categories; }
  getCategoryById(id) { return this.data.categories.find(c => c.id === id || c.slug === id); }
  addCategory(category) {
    const newCategory = {
      id: `cat-${Date.now()}`,
      slug: (category.name || 'category').toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      itemCount: 0,
      ...category
    };
    this.data.categories.push(newCategory);
    this.save();
    return newCategory;
  }
  updateCategory(id, updates) {
    const index = this.data.categories.findIndex(c => c.id === id);
    if (index === -1) return null;
    this.data.categories[index] = { ...this.data.categories[index], ...updates };
    this.save();
    return this.data.categories[index];
  }
  deleteCategory(id) {
    const index = this.data.categories.findIndex(c => c.id === id);
    if (index === -1) return false;
    this.data.categories.splice(index, 1);
    this.save();
    return true;
  }

  // --- Coupons ---
  getCoupons() { return this.data.coupons; }
  getCouponByCode(code) {
    return this.data.coupons.find(c => c.code.toUpperCase() === code.trim().toUpperCase());
  }
  addCoupon(coupon) {
    const newCoupon = {
      id: `coup-${Date.now()}`,
      usageCount: 0,
      isActive: true,
      ...coupon,
      code: coupon.code.toUpperCase()
    };
    this.data.coupons.unshift(newCoupon);
    this.save();
    return newCoupon;
  }
  updateCoupon(id, updates) {
    const index = this.data.coupons.findIndex(c => c.id === id);
    if (index === -1) return null;
    this.data.coupons[index] = { ...this.data.coupons[index], ...updates };
    this.save();
    return this.data.coupons[index];
  }
  deleteCoupon(id) {
    const index = this.data.coupons.findIndex(c => c.id === id);
    if (index === -1) return false;
    this.data.coupons.splice(index, 1);
    this.save();
    return true;
  }

  // --- Orders ---
  getOrders() { return this.data.orders; }
  getOrderById(id) { return this.data.orders.find(o => o.id === id); }
  getOrdersByUserId(userId) { return this.data.orders.filter(o => o.userId === userId); }
  addOrder(order) {
    const orderId = `ORD-${Math.floor(10000 + Math.random() * 90000)}`;
    const newOrder = {
      id: orderId,
      createdAt: new Date().toISOString(),
      orderStatus: "Confirmed",
      paymentStatus: order.paymentMethod === "Cash on Delivery" ? "Pending" : "Paid",
      ...order
    };
    this.data.orders.unshift(newOrder);

    // Reduce stock for products
    if (Array.isArray(order.items)) {
      order.items.forEach(item => {
        const prod = this.data.products.find(p => p.id === item.productId);
        if (prod && typeof prod.stock === 'number') {
          prod.stock = Math.max(0, prod.stock - (item.quantity || 1));
        }
      });
    }

    // Increment coupon usage
    if (order.couponCode) {
      const coup = this.getCouponByCode(order.couponCode);
      if (coup) {
        coup.usageCount = (coup.usageCount || 0) + 1;
      }
    }

    this.save();
    return newOrder;
  }
  updateOrderStatus(id, status) {
    const order = this.data.orders.find(o => o.id === id);
    if (!order) return null;
    order.orderStatus = status;
    if (status === "Delivered" && order.paymentMethod === "Cash on Delivery") {
      order.paymentStatus = "Paid";
    }
    this.save();
    return order;
  }
}

export const db = new StorageManager();
