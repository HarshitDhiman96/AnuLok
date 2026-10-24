import { Router } from 'express';
import { db } from '../storage/mongo.js';
import { verifyToken, requireAdmin } from '../middleware/auth.js';

const router = Router();

// POST /api/coupons/validate (Public)
router.post('/validate', async (req, res) => {
  try {
    const { code, cartSubtotal } = req.body;
    if (!code) {
      return res.status(400).json({ error: 'Please enter a coupon code' });
    }

    const subtotal = Number(cartSubtotal) || 0;
    const coupon = await db.getCouponByCode(code);

    if (!coupon || !coupon.isActive) {
      return res.status(400).json({
        valid: false,
        message: 'Invalid or expired coupon.'
      });
    }

    // Check expiry date
    if (coupon.expiryDate && new Date(coupon.expiryDate) < new Date()) {
      return res.status(400).json({
        valid: false,
        message: 'This coupon has expired.'
      });
    }

    // Check minimum order value
    if (coupon.minimumOrder && subtotal < coupon.minimumOrder) {
      return res.status(400).json({
        valid: false,
        message: `Minimum order value for ${coupon.code} is ₹${coupon.minimumOrder.toLocaleString('en-IN')}.`
      });
    }

    // Check usage limit
    if (coupon.usageLimit && (coupon.usageCount || 0) >= coupon.usageLimit) {
      return res.status(400).json({
        valid: false,
        message: 'This coupon has reached its maximum usage limit.'
      });
    }

    // Calculate discount
    let discountAmount = 0;
    if (coupon.discountType === 'percentage') {
      discountAmount = Math.round((subtotal * coupon.discountValue) / 100);
      if (coupon.maximumDiscount && discountAmount > coupon.maximumDiscount) {
        discountAmount = coupon.maximumDiscount;
      }
    } else {
      // fixed amount
      discountAmount = Math.min(coupon.discountValue, subtotal);
    }

    res.json({
      valid: true,
      message: 'Coupon applied successfully!',
      coupon: {
        code: coupon.code,
        name: coupon.name,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
        discountAmount
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/coupons (Admin only)
router.get('/', verifyToken, requireAdmin, async (req, res) => {
  try {
    const coupons = await db.getCoupons();
    res.json({ coupons });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/coupons (Admin only)
router.post('/', verifyToken, requireAdmin, async (req, res) => {
  try {
    const { code, name, discountType, discountValue, minimumOrder, maximumDiscount, expiryDate, usageLimit, isActive } = req.body;

    if (!code || !discountValue) {
      return res.status(400).json({ error: 'Coupon code and discount value are required' });
    }

    const existing = await db.getCouponByCode(code);
    if (existing) {
      return res.status(400).json({ error: 'A coupon with this code already exists' });
    }

    const newCoupon = await db.addCoupon({
      code: code.toUpperCase().trim(),
      name: name || code.toUpperCase(),
      discountType: discountType || 'percentage',
      discountValue: Number(discountValue),
      minimumOrder: Number(minimumOrder) || 0,
      maximumDiscount: maximumDiscount ? Number(maximumDiscount) : null,
      startDate: new Date().toISOString().split('T')[0],
      expiryDate: expiryDate || '2028-12-31',
      usageLimit: Number(usageLimit) || 1000,
      isActive: isActive !== undefined ? Boolean(isActive) : true
    });

    res.status(201).json({ message: 'Coupon created successfully', coupon: newCoupon });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/coupons/:id (Admin only)
router.put('/:id', verifyToken, requireAdmin, async (req, res) => {
  try {
    const updates = { ...req.body };
    if (updates.code) updates.code = updates.code.toUpperCase().trim();
    if (updates.discountValue) updates.discountValue = Number(updates.discountValue);
    if (updates.minimumOrder !== undefined) updates.minimumOrder = Number(updates.minimumOrder);
    if (updates.maximumDiscount !== undefined) updates.maximumDiscount = Number(updates.maximumDiscount);

    const updated = await db.updateCoupon(req.params.id, updates);
    if (!updated) {
      return res.status(404).json({ error: 'Coupon not found' });
    }
    res.json({ message: 'Coupon updated successfully', coupon: updated });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/coupons/:id (Admin only)
router.delete('/:id', verifyToken, requireAdmin, async (req, res) => {
  try {
    const success = await db.deleteCoupon(req.params.id);
    if (!success) {
      return res.status(404).json({ error: 'Coupon not found' });
    }
    res.json({ message: 'Coupon deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
