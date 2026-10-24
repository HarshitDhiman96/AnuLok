import { Router } from 'express';
import { db } from '../storage/mongo.js';
import { verifyToken, requireAdmin } from '../middleware/auth.js';

const router = Router();

// GET /api/categories
router.get('/', async (req, res) => {
  try {
    const categories = await db.getCategories();
    res.json({ categories });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/categories (Admin only)
router.post('/', verifyToken, requireAdmin, async (req, res) => {
  try {
    const { name, description, image } = req.body;
    if (!name) {
      return res.status(400).json({ error: 'Category name is required' });
    }

    const newCat = await db.addCategory({
      name,
      description: description || '',
      image: image || 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80'
    });

    res.status(201).json({ message: 'Category created successfully', category: newCat });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/categories/:id (Admin only)
router.put('/:id', verifyToken, requireAdmin, async (req, res) => {
  try {
    const updated = await db.updateCategory(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ error: 'Category not found' });
    }
    res.json({ message: 'Category updated successfully', category: updated });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/categories/:id (Admin only)
router.delete('/:id', verifyToken, requireAdmin, async (req, res) => {
  try {
    const success = await db.deleteCategory(req.params.id);
    if (!success) {
      return res.status(404).json({ error: 'Category not found' });
    }
    res.json({ message: 'Category deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
