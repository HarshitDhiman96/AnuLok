import '../config/env.js';
import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { db, normalizePhone } from '../storage/mongo.js';
import { generateToken, verifyToken } from '../middleware/auth.js';
import { sendRegistrationOtp, verifyRegistrationOtp } from '../services/otpService.js';

const router = Router();
const allowedGenders = ['female', 'male', 'other', 'non-binary', 'prefer-not-to-say'];

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

// POST /api/auth/send-registration-otp
router.post('/send-registration-otp', async (req, res, next) => {
  try {
    const { email, name, phone } = req.body;
    const normalizedEmail = String(email || '').trim().toLowerCase();
    const normalizedName = String(name || '').trim();

    if (!normalizedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      return res.status(400).json({ error: 'Please enter a valid email address.' });
    }

    // Check if phone or email already registered
    const checks = [{ email: normalizedEmail }];
    if (phone) {
      try {
        const normalizedPhone = normalizePhone(phone);
        checks.push({ phone: normalizedPhone });
      } catch {
        // phone validation handled in register if not valid
      }
    }

    const exists = await db.checkUserExists(checks);
    if (exists) {
      return res.status(409).json({ error: 'An account with this email or phone number already exists. Please sign in.' });
    }

    const result = await sendRegistrationOtp({ email: normalizedEmail, name: normalizedName });
    return res.json(result);
  } catch (error) {
    return next(error);
  }
});

// POST /api/auth/register
router.post('/register', async (req, res, next) => {
  try {
    const { name, email, password, phone, age, gender, address, otp } = req.body;
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
    if (!password || password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters.' });
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

    // Email OTP Verification
    if (!otp || String(otp).trim().length === 0) {
      return res.status(400).json({ error: 'Email verification code is required.' });
    }

    const verification = verifyRegistrationOtp({ email: normalizedEmail, code: otp });
    if (!verification.valid) {
      return res.status(400).json({ error: verification.error || 'Invalid or expired verification code.' });
    }

    const alternatives = [{ phone: normalizedPhone }, { email: normalizedEmail }];
    const exists = await db.checkUserExists(alternatives);
    if (exists) {
      return res.status(409).json({ error: 'An account with this phone or email already exists.' });
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const user = await db.createUser({
      id: `user-${Date.now()}`,
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
    return res.status(201).json({
      message: 'Account created and verified successfully.',
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
