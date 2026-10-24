import { Router } from 'express';
import { db } from '../storage/mongo.js';
import { verifyToken, requireAdmin } from '../middleware/auth.js';

const router = Router();

// GET /api/products
router.get('/', async (req, res) => {
  try {
    let products = [...await db.getProducts()];
    const { category, search, material, minPrice, maxPrice, minRating, sort, featured, inStockOnly } = req.query;

    if (category && category !== 'all') {
      products = products.filter(p => p.category.toLowerCase() === category.toLowerCase());
    }

    if (search && search.trim()) {
      const q = search.trim().toLowerCase();
      products = products.filter(p =>
        p.name.toLowerCase().includes(q) ||
        (p.description && p.description.toLowerCase().includes(q)) ||
        (p.categoryName && p.categoryName.toLowerCase().includes(q)) ||
        (p.material && p.material.toLowerCase().includes(q)) ||
        (Array.isArray(p.tags) && p.tags.some(t => t.toLowerCase().includes(q)))
      );
    }

    if (material && material !== 'all') {
      products = products.filter(p => p.material && p.material.toLowerCase().includes(material.toLowerCase()));
    }

    if (minPrice) {
      const min = Number(minPrice);
      products = products.filter(p => (p.discountPrice || p.price) >= min);
    }

    if (maxPrice) {
      const max = Number(maxPrice);
      products = products.filter(p => (p.discountPrice || p.price) <= max);
    }

    if (minRating) {
      const r = Number(minRating);
      products = products.filter(p => (p.rating || 0) >= r);
    }

    if (featured === 'true') {
      products = products.filter(p => p.featured === true);
    }

    if (inStockOnly === 'true') {
      products = products.filter(p => (p.stock || 0) > 0);
    }

    // Sorting
    switch (sort) {
      case 'price_asc':
        products.sort((a, b) => (a.discountPrice || a.price) - (b.discountPrice || b.price));
        break;
      case 'price_desc':
        products.sort((a, b) => (b.discountPrice || b.price) - (a.discountPrice || a.price));
        break;
      case 'rating_desc':
        products.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case 'discount_desc':
        products.sort((a, b) => (b.discountPercentage || 0) - (a.discountPercentage || 0));
        break;
      case 'newest':
        products.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
        break;
      default:
        // Featured first
        products.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
        break;
    }

    res.json({ count: products.length, products });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/products/:id
router.get('/:id', async (req, res) => {
  try {
    const product = await db.getProductById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Also find related products in the same category
    const related = (await db.getProducts())
      .filter(p => p.category === product.category && p.id !== product.id)
      .slice(0, 4);

    res.json({ product, related });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/products (Admin only)
router.post('/', verifyToken, requireAdmin, async (req, res) => {
  try {
    const {
      name, description, category, categoryName, price, discountPrice,
      images, material, colors, dimensions, weight, stock, sku, tags, featured,
      warranty, deliveryInfo, returnPolicy
    } = req.body;

    if (!name || !price || !category) {
      return res.status(400).json({ error: 'Name, price, and category are required' });
    }

    const numPrice = Number(price);
    const numDiscount = discountPrice ? Number(discountPrice) : numPrice;
    const discountPercentage = numPrice > numDiscount
      ? Math.round(((numPrice - numDiscount) / numPrice) * 100)
      : 0;

    const newProd = await db.addProduct({
      name,
      description: description || '',
      category,
      categoryName: categoryName || category,
      price: numPrice,
      discountPrice: numDiscount,
      discountPercentage,
      images: Array.isArray(images) && images.length > 0 ? images : [
        "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1200&q=80"
      ],
      material: material || 'Solid Hardwood',
      colors: Array.isArray(colors) ? colors : [{ name: 'Default', hex: '#8C6239' }],
      dimensions: dimensions || 'Standard Luxury Fit',
      weight: weight || '45 kg',
      stock: Number(stock) || 10,
      sku: sku || `ANU-${Math.floor(1000 + Math.random() * 9000)}`,
      tags: Array.isArray(tags) ? tags : ['furniture', 'luxury'],
      featured: Boolean(featured),
      warranty: warranty || '10-Year Craftsmanship Guarantee',
      deliveryInfo: deliveryInfo || 'Free White-Glove In-Home Delivery within 5-7 business days',
      returnPolicy: returnPolicy || '30-Day In-Home Trial'
    });

    res.status(201).json({ message: 'Product created successfully', product: newProd });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/products/:id (Admin only)
router.put('/:id', verifyToken, requireAdmin, async (req, res) => {
  try {
    const updates = { ...req.body };
    if (updates.price) updates.price = Number(updates.price);
    if (updates.discountPrice) updates.discountPrice = Number(updates.discountPrice);
    if (updates.stock !== undefined) updates.stock = Number(updates.stock);

    if (updates.price && updates.discountPrice) {
      updates.discountPercentage = Math.round(((updates.price - updates.discountPrice) / updates.price) * 100);
    }

    const updated = await db.updateProduct(req.params.id, updates);
    if (!updated) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json({ message: 'Product updated successfully', product: updated });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/products/:id (Admin only)
router.delete('/:id', verifyToken, requireAdmin, async (req, res) => {
  try {
    const success = await db.deleteProduct(req.params.id);
    if (!success) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json({ message: 'Product deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
