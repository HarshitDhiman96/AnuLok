import './config/env.js';
import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { db } from './storage/mongo.js';
import authRoutes from './routes/auth.js';
import productRoutes from './routes/products.js';
import categoryRoutes from './routes/categories.js';
import couponRoutes from './routes/coupons.js';
import orderRoutes from './routes/orders.js';
import adminRoutes from './routes/admin.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const CLIENT_DIST = path.join(__dirname, '../../client/dist');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    brand: 'Anulok Luxury Furniture',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/coupons', couponRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);

// Static frontend serving if dist exists
if (fs.existsSync(CLIENT_DIST)) {
  app.use(express.static(CLIENT_DIST));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) return next();
    res.sendFile(path.join(CLIENT_DIST, 'index.html'));
  });
}

// 404 Handler for API
app.use('/api/*', (req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ error: err.message || 'Internal server error' });
});

const startServer = async () => {
  await db.connect();
  const listen = (port, tryAlternatePort = true) => new Promise((resolve, reject) => {
    let listening = false;
    const server = app.listen(port, () => {
      listening = true;
      console.log(`[Anulok Server] Connected to MongoDB and running on http://localhost:${port}`);
      resolve(server);
    });
    server.once('error', (error) => {
      if (listening) {
        console.error('Server runtime error:', error);
        process.exitCode = 1;
        return;
      }
      if (error.code === 'EADDRINUSE' && tryAlternatePort) {
        const alternatePort = Number(port) + 1;
        console.log(`Port ${port} in use, trying ${alternatePort}...`);
        listen(alternatePort, false).then(resolve, reject);
        return;
      }
      reject(error);
    });
  });
  await listen(PORT);
};

startServer().catch((error) => {
  console.error('Server startup failed:', error);
  process.exitCode = 1;
});
