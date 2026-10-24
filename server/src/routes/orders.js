import { Router } from 'express';
import { db } from '../storage/mongo.js';
import { verifyToken, requireAdmin, optionalAuth } from '../middleware/auth.js';

const router = Router();

// POST /api/orders (Create new order)
router.post('/', optionalAuth, async (req, res) => {
  try {
    const {
      customer,
      items,
      subtotal,
      discount,
      couponCode,
      deliveryCharge,
      tax,
      total,
      paymentMethod
    } = req.body;

    const hasAddress = typeof customer?.address === 'string' && customer.address.trim().length > 0;
    const hasLocation = Number.isFinite(customer?.location?.latitude) &&
      Number.isFinite(customer?.location?.longitude);
    if (!customer || !customer.name || !customer.phone || (!hasAddress && !hasLocation)) {
      return res.status(400).json({ error: 'Customer details and a delivery address or location are required' });
    }

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Order must contain at least one item' });
    }

    const orderData = {
      userId: req.user ? req.user.id : null,
      customer,
      items,
      subtotal: Number(subtotal) || 0,
      discount: Number(discount) || 0,
      couponCode: couponCode || null,
      deliveryCharge: Number(deliveryCharge) || 0,
      tax: Number(tax) || 0,
      total: Number(total) || 0,
      paymentMethod: paymentMethod || 'Online Payment',
      orderStatus: 'Confirmed'
    };

    const newOrder = await db.addOrder(orderData);
    res.status(201).json({
      message: 'Order placed successfully',
      order: newOrder
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/orders/my (Customer orders)
router.get('/my', verifyToken, async (req, res) => {
  try {
    const orders = await db.getOrdersByUserId(req.user.id, req.user.email, req.user.phone);
    res.json({ orders });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/orders/:id (Order details by ID)
router.get('/:id', async (req, res) => {
  try {
    const order = await db.getOrderById(req.params.id);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.json({ order });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/orders (Admin only - get all orders with filtering)
router.get('/', verifyToken, requireAdmin, async (req, res) => {
  try {
    let orders = [...await db.getOrders()];
    const { status, search } = req.query;

    if (status && status !== 'all') {
      orders = orders.filter(o => o.orderStatus.toLowerCase() === status.toLowerCase());
    }

    if (search && search.trim()) {
      const q = search.trim().toLowerCase();
      orders = orders.filter(o =>
        o.id.toLowerCase().includes(q) ||
        String(o.customer?.name || '').toLowerCase().includes(q) ||
        String(o.customer?.email || '').toLowerCase().includes(q) ||
        String(o.customer?.phone || '').includes(q)
      );
    }

    res.json({ count: orders.length, orders });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/orders/:id/status (Admin only - update status)
router.put('/:id/status', verifyToken, requireAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    const allowed = ['Pending', 'Confirmed', 'Processing', 'Shipped', 'Out for Delivery', 'Delivered', 'Cancelled'];
    if (!allowed.includes(status)) {
      return res.status(400).json({ error: `Invalid status. Allowed values: ${allowed.join(', ')}` });
    }

    const updated = await db.updateOrderStatus(req.params.id, status);
    if (!updated) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.json({ message: 'Order status updated successfully', order: updated });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
