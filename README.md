# Anulok — Fine Living & Atelier

A modern, premium, and fully responsive e-commerce web platform for **Anulok**, a luxury lifestyle and architectural furniture brand.

Built with a bespoke aesthetic: warm cream, linen, natural teak wood, honed marble, and espresso tones, rejecting generic e-commerce templates in favor of contemplative, editorial interior design.

---

## 🏛️ Brand Identity

* **Brand Name**: **Anulok** ("Anu" = sacred/subtle, "Lok" = realm/home)
* **Design Philosophy**: Minimal, architectural, warm, trustworthy, and furniture/lifestyle focused.
* **Palette**:
  * Cream (`#FAF7F2`)
  * Warm Linen (`#F4EFEA`)
  * Solid Teak Wood (`#8C6239`)
  * Deep Walnut (`#5C3D24`)
  * Espresso Charcoal (`#1F1D1B`)
  * Amber Accent (`#C47B47`)
* **Typography**: Playfair Display (editorial serif) & Plus Jakarta Sans (clean, contemporary UI).

---

## ⚡ Tech Stack

* **Frontend**: React 19, Vite, Tailwind CSS, Lucide React, React Router v7.
* **Backend**: Node.js, Express.js, JWT (`jsonwebtoken`), Password Hashing (`bcryptjs`), CORS.
* **Database & Persistence**: MongoDB Atlas via Mongoose. Products, categories, coupons, orders, and user accounts are stored in MongoDB; the existing local store data seeds empty catalog/order collections on first startup.
* **Package Management**: Unified monorepo runner with `concurrently`.

---

## 🔐 Authentication & Environment Setup

1. Copy `server/.env.example` to `server/.env`.
2. Configure `MONGODB_URI` with a newly rotated MongoDB Atlas database-user password. Do not commit `.env` or share database credentials.
3. Set a randomly generated `JWT_SECRET` value (at least 32 characters).
4. To create the first administrator, set `ADMIN_EMAIL`, `ADMIN_PHONE`, and `ADMIN_PASSWORD` together.

New customer accounts require name, Indian phone number, age, gender, and password; email is optional. Passwords are bcrypt-hashed before storage. Sign-in accepts an email address or phone number and password. Phone verification by OTP is not used.

The existing local JSON store is read only as a one-time seed for products, categories, coupons, and orders when the corresponding MongoDB collections are empty. Legacy demo users are not migrated; create a new administrator using the environment variables above.

---

## 🏷️ Active Promotional Coupons

Customers can test the live discount engine during checkout or directly inside the cart:

| Coupon Code | Discount | Conditions |
| :--- | :--- | :--- |
| `WOOD10` | 10% OFF | Minimum order: ₹10,000 (Max discount cap: ₹5,000) |
| `ANULOK20` | 20% OFF | Minimum order: ₹25,000 (Max discount cap: ₹10,000) |
| `FESTIVE15` | 15% OFF | Minimum order: ₹15,000 (Max discount cap: ₹7,500) |
| `WELCOME500` | Flat ₹500 OFF | Minimum order: ₹5,000 |

---

## 🚀 Quick Start Guide

### 1. Configure MongoDB
```bash
Copy-Item server\.env.example server\.env
# Edit server\.env with MongoDB Atlas, JWT, and optional admin settings.
```

### 2. Launch Both Frontend & Backend (Development Mode)
```bash
# From the root folder:
npm run dev
```
* **Storefront & Client**: [http://localhost:5173](http://localhost:5173)
* **Backend API**: [http://localhost:5000/api](http://localhost:5000/api)

### 3. Run Automated API Sanity Tests
```bash
npm run test:api
```

### 4. Production Build & Unified Server
```bash
# Build the client bundle:
npm run build

# Start the unified Express server serving both API and static frontend:
npm start
```
Visit [http://localhost:5000](http://localhost:5000) to view the unified production deployment.

---

## 🌟 Key Features

### Customer Experience
1. **Sticky Header & Brand Navigation**: Custom architectural SVG emblem, real-time cart badge counter, wishlist badge, search toggle, and account dropdown.
2. **Hero Section**: High-definition interior background, editorial headline *"Furniture That Makes Your Space Feel Like Home"*, dual CTAs (*Shop Collection* & *Explore Categories*), and trust indicators.
3. **Featured Categories**: 8 rich cards (Sofas, Beds, Dining Tables, Accent Chairs, Wardrobes, Coffee Tables, TV Units, Office Furniture) with hover zoom and model counts.
4. **Featured Products**: Detailed product cards with dual pricing (₹ original & discounted), % OFF tags, ratings, wishlist toggle, quick view modal, and instant add-to-cart toast notifications.
5. **Shop & Filtering Suite**: Filter dynamically by Category, Price range slider (₹10,000 - ₹1,50,000), Material (Teak, Walnut, Bouclé, Leather, Marble, Travertine), Color swatches, Star rating, In-stock toggle, and Sorting (Featured, Price Low-High, Price High-Low, Rating, Newest, Discount %).
6. **Live Search**: Interactive search modal with real-time suggestions across product names, descriptions, categories, and tags.
7. **Product Details Page**: Multi-angle image gallery with thumbnail preview, dynamic discount math, color swatch selector, stock indicator, dimensions/weight specs, pincode delivery estimator, Add to Cart, Buy Now, and tabbed specifications (Materials, White-glove assembly, 10-year warranty, In-home trial).
8. **Slide-Over Cart Drawer & Full Cart**: Live subtotal, free delivery threshold meter (Free above ₹25,000, else ₹999), coupon application engine, 18% GST calculation, quantity adjusters, and persistent state in `localStorage`.
9. **Checkout & Order Confirmation**: Customer address form, payment method selector (Online Payment simulation vs. Cash on Delivery), order placement, and printable confirmation receipt with tracking progress stepper.

### Admin Dashboard (`/admin`)
1. **Protected Route**: Secured by JWT and admin role verification.
2. **Overview & Analytics**: KPI metrics (Total Revenue, Orders, Catalog size, Customers, Low Stock alerts, Active discounts) plus interactive SVG trend charts and category sales share.
3. **Product Management**: Full CRUD to add products (with dimensions, materials, colors, images, tags, prices, stock), edit, update prices, and delete.
4. **Category Management**: Create, edit, and delete store categories.
5. **Discount Management**: Create coupons, configure % vs fixed values, set minimum order values and maximum caps, toggle active status.
6. **Order Management**: Order table with live status updates (`Pending`, `Confirmed`, `Processing`, `Shipped`, `Out for Delivery`, `Delivered`, `Cancelled`).
7. **Customer Directory**: View customer purchasing records and lifetime spend.
