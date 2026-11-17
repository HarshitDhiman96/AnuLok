import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';
import { randomUUID } from 'crypto';

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

export const initialProducts = [];

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
      products: [],
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
    const newUser = { id: `user-${randomUUID()}`, createdAt: new Date().toISOString(), ...user };
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
      featured: Boolean(category.featured),
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
