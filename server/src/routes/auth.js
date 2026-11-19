import '../config/env.js';
import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { randomUUID, randomInt, createHash, timingSafeEqual } from 'crypto';
import { db, normalizePhone } from '../storage/mongo.js';
import { generateToken, verifyToken } from '../middleware/auth.js';

const router = Router();
const emailCodes = new Map();
const allowedGenders = ['female', 'male', 'other', 'non-binary', 'prefer-not-to-say'];

const normalizeEmail = (email) => String(email || '').trim().toLowerCase();
const codeHash = (email, code, salt) => createHash('sha256').update(`${email}:${salt}:${code}`).digest();

// POST /api/auth/register/send-code
router.post('/register/send-code', async (req, res, next) => {
  try {
    const email = normalizeEmail(req.body.email);
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ error: 'Enter a valid email address.' });
    }
    if (!process.env.RESEND_API_KEY) {
      return res.status(503).json({ error: 'Email verification is not configured on the server.' });
    }
    if (await db.checkUserExists([{ email }])) {
      return res.status(409).json({ error: 'An account with this email already exists.' });
    }
    const previous = emailCodes.get(email);
    if (previous && Date.now() - previous.sentAt < 60_000) {
      return res.status(429).json({ error: 'Please wait a minute before requesting another code.' });
    }
    const code = String(randomInt(0, 1_000_000)).padStart(6, '0');
    const salt = randomUUID();
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: process.env.RESEND_FROM_EMAIL || 'noreply@anulokfurniture.shop',
        to: [email],
        subject: 'Your Anulok verification code',
        html: `<p>Your Anulok verification code is:</p><p style="font-size:28px;font-weight:bold;letter-spacing:6px">${code}</p><p>This code expires in 10 minutes. If you did not request it, you can ignore this email.</p>`
      })
    });
    if (!response.ok) {
      const detail = await response.json().catch(() => ({}));
      console.error('Resend email error:', detail);
      return res.status(502).json({ error: 'Could not send the verification email. Please try again.' });
    }
    emailCodes.set(email, { hash: codeHash(email, code, salt), salt, expiresAt: Date.now() + 10 * 60_000, sentAt: Date.now(), attempts: 0 });
    return res.json({ message: 'Verification code sent. Check your email.' });
  } catch (error) {
    return next(error);
  }
});

const publicUser = (user) => ({
  id: user.id,
  name: user.name,
  email: user.email || '',
  phone: user.phone || '',
  age: user.age,
  gender: user.gender,
  address: user.address || '',
  role: user.role
});

// POST /api/auth/register
router.post('/register', async (req, res, next) => {
  try {
    const { name, email, password, phone, age, gender, address, verificationCode } = req.body;
    const normalizedName = String(name || '').trim();
    const normalizedEmail = String(email || '').trim().toLowerCase();
    const normalizedPhone = normalizePhone(phone);
    const normalizedAddress = String(address || '').trim();
    const numericAge = Number(age);

    if (!normalizedName || normalizedName.length > 100) {
      return res.status(400).json({ error: 'Enter your name (up to 100 characters).' });
    }
    if (!normalizedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      return res.status(400).json({ error: 'Enter a valid email address.' });
    }
    const pendingCode = emailCodes.get(normalizedEmail);
    const submittedCode = String(verificationCode || '').trim();
    if (!pendingCode || pendingCode.expiresAt < Date.now()) {
      emailCodes.delete(normalizedEmail);
      return res.status(400).json({ error: 'Please request a new email verification code.' });
    }
    if (!/^\d{6}$/.test(submittedCode) || !timingSafeEqual(pendingCode.hash, codeHash(normalizedEmail, submittedCode, pendingCode.salt))) {
      pendingCode.attempts += 1;
      if (pendingCode.attempts >= 5) emailCodes.delete(normalizedEmail);
      return res.status(400).json({ error: 'That code is incorrect. Please try again.' });
    }
    if (!password || password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters.' });
    }
    if (await db.passwordMatchesAdmin(password)) {
      return res.status(400).json({ error: 'Choose a password that is different from the store administrator password.' });
    }
    if (!Number.isInteger(numericAge) || numericAge < 1 || numericAge > 120) {
      return res.status(400).json({ error: 'Enter a valid age between 1 and 120.' });
    }
    if (!allowedGenders.includes(gender)) {
      return res.status(400).json({ error: 'Choose a gender option (female, male, other, non-binary, prefer-not-to-say).' });
    }
    if (!normalizedAddress) {
      return res.status(400).json({ error: 'Enter your delivery address.' });
    }

    const alternatives = [{ phone: normalizedPhone }, { email: normalizedEmail }];
    const exists = await db.checkUserExists(alternatives);
    if (exists) {
      return res.status(409).json({ error: 'An account with this phone or email already exists.' });
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const user = await db.createUser({
      id: `user-${randomUUID()}`,
      name: normalizedName,
      email: normalizedEmail,
      phone: normalizedPhone,
      age: numericAge,
      gender,
      address: normalizedAddress,
      passwordHash,
      role: 'customer'
    });

    const safeUser = publicUser(user);
    emailCodes.delete(normalizedEmail);
    return res.status(201).json({
      message: 'Account created successfully.',
      token: generateToken(safeUser),
      user: safeUser
    });
  } catch (error) {
    if (error.message && error.message.startsWith('Enter a valid 10-digit')) {
      return res.status(400).json({ error: error.message });
    }
    if (error.code === 11000) {
      return res.status(409).json({ error: 'An account with this phone or email already exists.' });
    }
    return next(error);
  }
});

// POST /api/auth/login
router.post('/login', async (req, res, next) => {
  try {
    const { identifier, email, phone, password } = req.body;
    const loginIdentifier = String(identifier || email || phone || '').trim();
    if (!loginIdentifier || !password) {
      return res.status(400).json({ error: 'Email or phone number and password are required.' });
    }

    const query = loginIdentifier.includes('@')
      ? { email: loginIdentifier.toLowerCase() }
      : { phone: normalizePhone(loginIdentifier) };

    const user = await db.findUser(query);
    if (!user) {
      return res.status(401).json({ error: 'Invalid email/phone or password.' });
    }

    const hashToCompare = user.passwordHash || user.password;
    if (!hashToCompare || !await bcrypt.compare(password, hashToCompare)) {
      return res.status(401).json({ error: 'Invalid email/phone or password.' });
    }

    await db.recordUserLogin(user.id);

    const safeUser = publicUser(user);
    return res.json({
      message: 'Signed in successfully.',
      token: generateToken(safeUser),
      user: safeUser
    });
  } catch (error) {
    if (error.message && error.message.startsWith('Enter a valid 10-digit')) {
      return res.status(400).json({ error: error.message });
    }
    return next(error);
  }
});

// GET /api/auth/me
router.get('/me', verifyToken, async (req, res, next) => {
  try {
    const user = await db.getUserById(req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found.' });
    return res.json({ user: publicUser(user) });
  } catch (error) {
    return next(error);
  }
});

router.get('/cart', verifyToken, async (req, res, next) => {
  try {
    return res.json(await db.getUserCart(req.user.id));
  } catch (error) {
    return next(error);
  }
});

router.put('/cart', verifyToken, async (req, res, next) => {
  try {
    const items = req.body.items;
    if (!Array.isArray(items) || items.length > 100) {
      return res.status(400).json({ error: 'Cart must contain no more than 100 items.' });
    }
    if (items.some(item => !item || typeof item !== 'object' || Array.isArray(item))) {
      return res.status(400).json({ error: 'Cart items must be valid objects.' });
    }
    const safeItems = items.map((item) => ({
      cartItemId: String(item.cartItemId || '').slice(0, 200),
      id: String(item.id || '').slice(0, 100),
      name: String(item.name || '').slice(0, 200),
      slug: String(item.slug || '').slice(0, 200),
      price: Number(item.price) || 0,
      originalPrice: Number(item.originalPrice) || 0,
      discountPercentage: Number(item.discountPercentage) || 0,
      image: String(item.image || '').slice(0, 2000),
      material: String(item.material || '').slice(0, 300),
      category: String(item.category || '').slice(0, 100),
      categoryName: String(item.categoryName || '').slice(0, 150),
      colorName: String(item.colorName || '').slice(0, 100),
      colorHex: String(item.colorHex || '').slice(0, 20),
      quantity: Math.max(1, Math.min(99, Math.floor(Number(item.quantity) || 1))),
      stock: Math.max(0, Number(item.stock) || 0)
    }));
    if (safeItems.some(item => !item.id || !item.cartItemId || !item.name)) {
      return res.status(400).json({ error: 'Each cart item must have a product ID, cart item ID, and name.' });
    }
    const coupon = req.body.appliedCoupon && typeof req.body.appliedCoupon === 'object'
      ? {
          code: String(req.body.appliedCoupon.code || '').slice(0, 50),
          name: String(req.body.appliedCoupon.name || '').slice(0, 100),
          discountType: ['percentage', 'fixed'].includes(req.body.appliedCoupon.discountType)
            ? req.body.appliedCoupon.discountType
            : 'fixed',
          discountValue: Math.max(0, Number(req.body.appliedCoupon.discountValue) || 0),
          maximumDiscount: Math.max(0, Number(req.body.appliedCoupon.maximumDiscount) || 0),
          discountAmount: Math.max(0, Number(req.body.appliedCoupon.discountAmount) || 0)
        }
      : null;
    const saved = await db.saveUserCart(req.user.id, safeItems, coupon);
    if (!saved) return res.status(404).json({ error: 'User account not found.' });
    return res.json({ items: safeItems, appliedCoupon: coupon });
  } catch (error) {
    return next(error);
  }
});

router.get('/wishlist', verifyToken, async (req, res, next) => {
  try {
    return res.json({ products: await db.getUserWishlist(req.user.id) });
  } catch (error) {
    return next(error);
  }
});

router.put('/wishlist', verifyToken, async (req, res, next) => {
  try {
    const productIds = req.body.productIds;
    if (!Array.isArray(productIds) || productIds.length > 200) {
      return res.status(400).json({ error: 'Wishlist must contain no more than 200 products.' });
    }
    if (productIds.some(id => typeof id !== 'string')) {
      return res.status(400).json({ error: 'Wishlist product IDs must be strings.' });
    }
    const knownIds = new Set((await db.getProducts()).map(product => product.id));
    const safeIds = [...new Set(productIds.map(id => String(id).slice(0, 100)))].filter(id => knownIds.has(id));
    const saved = await db.saveUserWishlist(req.user.id, safeIds);
    if (!saved) return res.status(404).json({ error: 'User account not found.' });
    return res.json({ products: await db.getUserWishlist(req.user.id) });
  } catch (error) {
    return next(error);
  }
});

// POST /api/auth/change-password
router.post('/change-password', verifyToken, async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Current password and new password are required.' });
    }
    if (newPassword.length < 6) {
      return res.status(400).json({ error: 'New password must be at least 6 characters.' });
    }

    const user = await db.findUser({ id: req.user.id });
    if (!user) {
      return res.status(404).json({ error: 'User account not found.' });
    }

    const hashToCompare = user.passwordHash || user.password;
    if (!hashToCompare || !await bcrypt.compare(currentPassword, hashToCompare)) {
      return res.status(400).json({ error: 'Current password is incorrect.' });
    }

    const newHash = await bcrypt.hash(newPassword, 12);
    await db.updateUserPassword(user.id, newHash);

    return res.json({ message: 'Password updated successfully.' });
  } catch (error) {
    return next(error);
  }
});

// PATCH /api/auth/profile
router.patch('/profile', verifyToken, async (req, res, next) => {
  try {
    const { name, phone, age, gender, address } = req.body;
    const updates = {};
    if (name !== undefined) updates.name = name;
    if (phone !== undefined) updates.phone = phone;
    if (age !== undefined) updates.age = age;
    if (gender !== undefined) updates.gender = gender;
    if (address !== undefined) updates.address = address;

    const updatedUser = await db.updateUserProfile(req.user.id, updates);
    if (!updatedUser) {
      return res.status(404).json({ error: 'User account not found.' });
    }

    return res.json({
      message: 'Profile updated successfully.',
      user: publicUser(updatedUser)
    });
  } catch (error) {
    return next(error);
  }
});

export default router;
