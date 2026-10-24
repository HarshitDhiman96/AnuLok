import { Router } from 'express';
import { db } from '../storage/mongo.js';
import { verifyToken, requireAdmin } from '../middleware/auth.js';

const router = Router();

// GET /api/admin/stats
router.get('/stats', verifyToken, requireAdmin, async (req, res) => {
  try {
    const [products, orders, users, coupons, categories] = await Promise.all([
      db.getProducts(),
      db.getOrders(),
      db.getUsers(),
      db.getCoupons(),
      db.getCategories()
    ]);

    // Customers list
    const customers = users.filter(u => u.role === 'customer');

    // Revenue calculation (from orders that aren't cancelled)
    const validOrders = orders.filter(o => o.orderStatus !== 'Cancelled');
    const totalRevenue = validOrders.reduce((sum, o) => sum + (o.total || 0), 0);

    // Low stock products (stock <= 5)
    const lowStockProducts = products.filter(p => (p.stock || 0) <= 5);

    // Active discounts
    const activeDiscounts = coupons.filter(c => c.isActive).length;

    // Sales by category
    const categorySales = {};
    categories.forEach(c => { categorySales[c.slug] = 0; });
    validOrders.forEach(o => {
      (o.items || []).forEach(item => {
        const prod = products.find(p => p.id === item.productId);
        if (prod && prod.category) {
          categorySales[prod.category] = (categorySales[prod.category] || 0) + (item.price * item.quantity);
        }
      });
    });

    const categoryDistribution = categories.map(c => ({
      name: c.name,
      slug: c.slug,
      sales: categorySales[c.slug] || 0
    }));

    // Revenue over last 7 days / recent orders trend
    const dayMap = {};
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
      dayMap[key] = { revenue: 0, orders: 0 };
    }

    validOrders.forEach(o => {
      const date = new Date(o.createdAt);
      const key = date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
      if (dayMap[key]) {
        dayMap[key].revenue += (o.total || 0);
        dayMap[key].orders += 1;
      }
    });

    const trend = Object.keys(dayMap).map(day => ({
      day,
      revenue: dayMap[day].revenue,
      orders: dayMap[day].orders
    }));

    // Best-selling products
    const productSalesMap = {};
    validOrders.forEach(o => {
      (o.items || []).forEach(item => {
        productSalesMap[item.productId] = (productSalesMap[item.productId] || 0) + (item.quantity || 1);
      });
    });

    const bestSellers = products
      .map(p => ({
        id: p.id,
        name: p.name,
        category: p.categoryName || p.category,
        price: p.discountPrice || p.price,
        unitsSold: productSalesMap[p.id] || 0,
        image: p.images && p.images[0]
      }))
      .sort((a, b) => b.unitsSold - a.unitsSold)
      .slice(0, 5);

    // Customer spending summary
    const customerStats = customers.map(c => {
      const custOrders = orders.filter(o => o.userId === c.id || (o.customer && o.customer.email === c.email));
      const totalSpend = custOrders.reduce((sum, o) => sum + (o.total || 0), 0);
      return {
        id: c.id,
        name: c.name,
        email: c.email,
        phone: c.phone || 'N/A',
        ordersCount: custOrders.length,
        totalSpend,
        createdAt: c.createdAt
      };
    });

    res.json({
      summary: {
        totalRevenue,
        totalOrders: orders.length,
        totalProducts: products.length,
        totalCustomers: customers.length,
        lowStockCount: lowStockProducts.length,
        activeDiscountsCount: activeDiscounts
      },
      lowStockProducts,
      categoryDistribution,
      trend,
      bestSellers,
      customers: customerStats
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/admin/customers
router.get('/customers', verifyToken, requireAdmin, async (req, res) => {
  try {
    const [allUsers, orders] = await Promise.all([db.getUsers(), db.getOrders()]);
    const users = allUsers.filter(u => u.role === 'customer');

    const customerList = users.map(c => {
      const custOrders = orders.filter(o => o.userId === c.id || (o.customer && o.customer.email === c.email));
      const totalSpend = custOrders.reduce((sum, o) => sum + (o.total || 0), 0);
      return {
        id: c.id,
        name: c.name,
        email: c.email,
        phone: c.phone || 'N/A',
        ordersCount: custOrders.length,
        totalSpend,
        createdAt: c.createdAt
      };
    });

    res.json({ customers: customerList });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
