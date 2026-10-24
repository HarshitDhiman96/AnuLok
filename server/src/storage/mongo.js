import '../config/env.js';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { User } from '../models/User.js';
import { StoreRecord } from '../models/StoreRecord.js';
import {
  db as localStore,
  initialCategories,
  initialProducts,
  initialCoupons,
  initialOrders
} from './db.js';

const currentDir = path.dirname(fileURLToPath(import.meta.url));
const legacyStorePath = path.resolve(currentDir, '../../data/store.json');

const plainUser = (user) => {
  if (!user) return null;
  const value = user.toObject ? user.toObject() : user;
  const { _id, __v, passwordHash, ...safeUser } = value;
  return safeUser;
};

const recordData = (record) => record?.data || null;

class MongoStore {
  constructor() {
    this.isMongo = false;
  }

  async connect() {
    const uri = process.env.MONGODB_URI;
    if (uri) {
      try {
        console.log('[Anulok Storage] Connecting to MongoDB Atlas...');
        await mongoose.connect(uri, {
          dbName: process.env.MONGODB_DB_NAME || 'anulok',
          serverSelectionTimeoutMS: 5000
        });
        this.isMongo = true;
        console.log('[Anulok Storage] Connected to MongoDB Atlas successfully.');
        await StoreRecord.init();
        await User.init();
        await this.seedRecords();
        await this.bootstrapAdmin();
        return;
      } catch (err) {
        console.warn(`[Anulok Storage] MongoDB connection attempt failed: ${err.message}`);
        console.warn('[Anulok Storage] Operating in resilient local storage mode. Update MONGODB_URI in server/.env to reconnect.');
      }
    } else {
      console.log('[Anulok Storage] No MONGODB_URI configured in server/.env. Operating in resilient local storage mode.');
    }
    this.isMongo = false;
  }

  async seedRecords() {
    let legacyData = {};
    if (fs.existsSync(legacyStorePath)) {
      try {
        legacyData = JSON.parse(fs.readFileSync(legacyStorePath, 'utf8'));
      } catch (error) {
        console.warn(`Unable to read existing store data: ${error.message}`);
      }
    }

    const defaults = {
      products: initialProducts,
      categories: initialCategories,
      coupons: initialCoupons,
      orders: initialOrders,
      reviews: []
    };

    for (const [collection, fallback] of Object.entries(defaults)) {
      const count = await StoreRecord.countDocuments({ kind: collection });
      if (count > 0) continue;
      const rows = Array.isArray(legacyData[collection]) && legacyData[collection].length
        ? legacyData[collection]
        : fallback;
      if (rows.length) {
        await StoreRecord.insertMany(rows.map((data) => ({
          kind: collection,
          id: String(data.id),
          data
        })));
      }
    }
  }

  async bootstrapAdmin() {
    const { ADMIN_EMAIL, ADMIN_PHONE, ADMIN_PASSWORD } = process.env;
    if (!ADMIN_EMAIL && !ADMIN_PHONE && !ADMIN_PASSWORD) return;
    if (!ADMIN_EMAIL || !ADMIN_PHONE || !ADMIN_PASSWORD) {
      console.warn('Set ADMIN_EMAIL, ADMIN_PHONE, and ADMIN_PASSWORD together to bootstrap an admin.');
      return;
    }

    const email = ADMIN_EMAIL.trim().toLowerCase();
    const phone = normalizePhone(ADMIN_PHONE);
    const existingAdmin = await User.findOne({ role: 'admin' });
    if (existingAdmin) return;

    const conflictingUser = await User.findOne({ $or: [{ email }, { phone }] });
    if (conflictingUser) {
      console.warn('Admin bootstrap email or phone is already assigned to another account.');
      return;
    }

    await User.create({
      id: `user-${new mongoose.Types.ObjectId().toString()}`,
      name: 'Anulok Store Admin',
      email,
      phone,
      age: 35,
      gender: 'prefer-not-to-say',
      address: 'Anulok Headquarters, Indiranagar, Bengaluru 560038',
      passwordHash: await bcrypt.hash(ADMIN_PASSWORD, 12),
      role: 'admin'
    });
  }

  // User operations
  async findUser(query) {
    if (this.isMongo) {
      return await User.findOne(query).select('+passwordHash');
    }
    const users = localStore.getUsers();
    if (query.$or) {
      return users.find(u => query.$or.some(cond => {
        if (cond.email && u.email && u.email.toLowerCase() === cond.email.toLowerCase()) return true;
        if (cond.phone && u.phone && u.phone === cond.phone) return true;
        return false;
      })) || null;
    }
    if (query.email) {
      return users.find(u => u.email?.toLowerCase() === query.email.toLowerCase()) || null;
    }
    if (query.phone) {
      return users.find(u => u.phone === query.phone) || null;
    }
    return null;
  }

  async checkUserExists(alternatives) {
    if (this.isMongo) {
      return await User.exists({ $or: alternatives });
    }
    const users = localStore.getUsers();
    return users.some(u => alternatives.some(alt => {
      if (alt.email && u.email && u.email.toLowerCase() === alt.email.toLowerCase()) return true;
      if (alt.phone && u.phone && u.phone === alt.phone) return true;
      return false;
    }));
  }

  async createUser(userData) {
    if (this.isMongo) {
      return await User.create(userData);
    }
    const newUser = localStore.addUser({
      id: `user-${Date.now()}`,
      createdAt: new Date().toISOString(),
      ...userData
    });
    return newUser;
  }

  async getUsers() {
    if (this.isMongo) {
      return (await User.find().select('-passwordHash').lean()).map(plainUser);
    }
    return localStore.getUsers().map(plainUser);
  }

  async getUserById(id) {
    if (this.isMongo) {
      return plainUser(await User.findOne({ id }).select('-passwordHash').lean());
    }
    return plainUser(localStore.getUserById(id));
  }

  async getUserByEmail(email) {
    if (!email) return null;
    if (this.isMongo) {
      return plainUser(await User.findOne({ email: email.trim().toLowerCase() }).select('-passwordHash').lean());
    }
    return plainUser(localStore.getUserByEmail(email));
  }

  async getUserByPhone(phone) {
    if (!phone) return null;
    if (this.isMongo) {
      return plainUser(await User.findOne({ phone: normalizePhone(phone) }).select('-passwordHash').lean());
    }
    return plainUser(localStore.getUsers().find(u => u.phone === normalizePhone(phone)));
  }

  async updateUserPassword(id, passwordHash) {
    if (this.isMongo) {
      await User.updateOne({ id }, { $set: { passwordHash } });
      return true;
    }
    return localStore.updateUser(id, { passwordHash });
  }

  async updateUserProfile(id, updates) {
    const allowed = {};
    if (updates.name !== undefined) allowed.name = String(updates.name).trim();
    if (updates.address !== undefined) allowed.address = String(updates.address).trim();
    if (updates.age !== undefined && updates.age !== null) allowed.age = Number(updates.age);
    if (updates.gender !== undefined) allowed.gender = updates.gender;
    if (updates.phone !== undefined && updates.phone) allowed.phone = normalizePhone(updates.phone);

    if (this.isMongo) {
      const updated = await User.findOneAndUpdate({ id }, { $set: allowed }, { new: true }).select('-passwordHash').lean();
      return plainUser(updated);
    }
    return plainUser(localStore.updateUser(id, allowed));
  }

  // Products
  async getProducts() {
    if (this.isMongo) {
      return this.getRecords('products');
    }
    return localStore.getProducts();
  }

  async getProductById(id) {
    if (this.isMongo) {
      return (await StoreRecord.findOne({
        kind: 'products',
        $or: [{ id }, { 'data.slug': id }]
      }).lean())?.data || null;
    }
    return localStore.getProductById(id);
  }

  async addProduct(product) {
    const id = this.isMongo ? `prod-${new mongoose.Types.ObjectId().toString()}` : `prod-${Date.now()}`;
    const newProduct = {
      id,
      slug: (product.name || 'product').toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      rating: 5,
      reviewCount: 0,
      createdAt: new Date().toISOString(),
      ...product
    };
    if (this.isMongo) {
      await this.insertRecord('products', newProduct);
    } else {
      localStore.addProduct(newProduct);
    }
    return newProduct;
  }

  async updateProduct(id, updates) {
    if (this.isMongo) {
      return this.updateRecord('products', id, updates);
    }
    return localStore.updateProduct(id, updates);
  }

  async deleteProduct(id) {
    if (this.isMongo) {
      return this.deleteRecord('products', id);
    }
    return localStore.deleteProduct(id);
  }

  // Categories
  async getCategories() {
    if (this.isMongo) {
      return this.getRecords('categories');
    }
    return localStore.getCategories();
  }

  async getCategoryById(id) {
    if (this.isMongo) {
      return recordData(await StoreRecord.findOne({ kind: 'categories', id }).lean());
    }
    return localStore.getCategoryById(id);
  }

  async addCategory(category) {
    const id = this.isMongo ? `cat-${new mongoose.Types.ObjectId().toString()}` : `cat-${Date.now()}`;
    const newCategory = {
      id,
      slug: (category.name || 'category').toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      itemCount: 0,
      ...category
    };
    if (this.isMongo) {
      await this.insertRecord('categories', newCategory);
    } else {
      localStore.addCategory(newCategory);
    }
    return newCategory;
  }

  async updateCategory(id, updates) {
    if (this.isMongo) {
      return this.updateRecord('categories', id, updates);
    }
    return localStore.updateCategory(id, updates);
  }

  async deleteCategory(id) {
    if (this.isMongo) {
      return this.deleteRecord('categories', id);
    }
    return localStore.deleteCategory(id);
  }

  // Coupons
  async getCoupons() {
    if (this.isMongo) {
      return this.getRecords('coupons');
    }
    return localStore.getCoupons();
  }

  async getCouponByCode(code) {
    if (!code) return null;
    const normalized = code.trim().toUpperCase();
    if (this.isMongo) {
      const found = await StoreRecord.findOne({
        kind: 'coupons',
        'data.code': normalized
      }).lean();
      return recordData(found);
    }
    return localStore.getCouponByCode(normalized);
  }

  async addCoupon(coupon) {
    const id = this.isMongo ? `coup-${new mongoose.Types.ObjectId().toString()}` : `coup-${Date.now()}`;
    const newCoupon = {
      id,
      usageCount: 0,
      isActive: true,
      ...coupon,
      code: coupon.code.toUpperCase()
    };
    if (this.isMongo) {
      await this.insertRecord('coupons', newCoupon);
    } else {
      localStore.addCoupon(newCoupon);
    }
    return newCoupon;
  }

  async updateCoupon(id, updates) {
    if (this.isMongo) {
      return this.updateRecord('coupons', id, updates);
    }
    return localStore.updateCoupon(id, updates);
  }

  async deleteCoupon(id) {
    if (this.isMongo) {
      return this.deleteRecord('coupons', id);
    }
    return localStore.deleteCoupon(id);
  }

  // Orders
  async getOrders() {
    if (this.isMongo) {
      return this.getRecords('orders');
    }
    return localStore.getOrders();
  }

  async getOrderById(id) {
    if (this.isMongo) {
      return recordData(await StoreRecord.findOne({ kind: 'orders', id }).lean());
    }
    return localStore.getOrderById(id);
  }

  async getOrdersByUserId(userId, userEmail = null, userPhone = null) {
    const normEmail = userEmail ? userEmail.trim().toLowerCase() : null;
    const normPhone = userPhone ? normalizePhone(userPhone) : null;

    const matches = (order) => {
      if (order.userId === userId) return true;
      if (normEmail && order.customer?.email?.toLowerCase() === normEmail) return true;
      if (normPhone && order.customer?.phone === normPhone) return true;
      return false;
    };

    if (this.isMongo) {
      const orders = await this.getRecords('orders');
      return orders.filter(matches);
    }
    const orders = localStore.getOrders();
    return orders.filter(matches);
  }

  async addOrder(order) {
    const orderId = `ORD-${Math.floor(10000 + Math.random() * 90000)}`;
    const newOrder = {
      id: orderId,
      createdAt: new Date().toISOString(),
      orderStatus: 'Confirmed',
      paymentStatus: order.paymentMethod === 'Cash on Delivery' ? 'Pending' : 'Paid',
      ...order
    };

    if (this.isMongo) {
      try {
        const session = await mongoose.startSession();
        await session.withTransaction(async () => {
          await StoreRecord.create([{
            kind: 'orders',
            id: orderId,
            data: newOrder
          }], { session });

          for (const item of order.items || []) {
            const product = await StoreRecord.findOne({
              kind: 'products',
              id: item.productId
            }).session(session);
            if (!product || typeof product.data.stock !== 'number') continue;
            product.data.stock = Math.max(0, product.data.stock - (item.quantity || 1));
            product.markModified('data');
            await product.save({ session });
          }

          if (order.couponCode) {
            const coupon = await StoreRecord.findOne({
              kind: 'coupons',
              'data.code': order.couponCode.trim().toUpperCase()
            }).session(session);
            if (coupon) {
              coupon.data.usageCount = (coupon.data.usageCount || 0) + 1;
              coupon.markModified('data');
              await coupon.save({ session });
            }
          }
        });
        await session.endSession();
        return newOrder;
      } catch (err) {
        console.warn('Mongo order transaction error, inserting directly:', err.message);
        await this.insertRecord('orders', newOrder);
        return newOrder;
      }
    } else {
      return localStore.addOrder(newOrder);
    }
  }

  async updateOrderStatus(id, status) {
    const order = await this.getOrderById(id);
    if (!order) return null;
    const updates = { orderStatus: status };
    if (status === 'Delivered' && order.paymentMethod === 'Cash on Delivery') {
      updates.paymentStatus = 'Paid';
    }
    if (this.isMongo) {
      return this.updateRecord('orders', id, updates);
    }
    return localStore.updateOrderStatus(id, status);
  }

  async getRecords(collection) {
    const records = await StoreRecord.find({ kind: collection }).sort({ _id: 1 }).lean();
    return records.map((record) => record.data);
  }

  async insertRecord(collection, data) {
    await StoreRecord.create({ kind: collection, id: String(data.id), data });
    return data;
  }

  async updateRecord(collection, id, updates) {
    const record = await StoreRecord.findOne({ kind: collection, id });
    if (!record) return null;
    record.data = { ...record.data, ...updates };
    record.markModified('data');
    await record.save();
    return record.data;
  }

  async deleteRecord(collection, id) {
    const result = await StoreRecord.deleteOne({ kind: collection, id });
    return result.deletedCount > 0;
  }
}

export const normalizePhone = (value) => {
  const digits = String(value || '').replace(/\D/g, '');
  const national = digits.startsWith('91') && digits.length === 12 ? digits.slice(2) : digits;
  if (!/^[6-9]\d{9}$/.test(national)) {
    throw new Error('Enter a valid 10-digit Indian mobile number.');
  }
  return `+91${national}`;
};

export const db = new MongoStore();
