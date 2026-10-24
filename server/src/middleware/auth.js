import '../config/env.js';
import jwt from 'jsonwebtoken';
import { db } from '../storage/mongo.js';

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET || JWT_SECRET.length < 32) {
  throw new Error('JWT_SECRET must be configured with at least 32 characters.');
}

export const generateToken = (user) => {
  return jwt.sign(
    { sub: user.id, role: user.role },
    JWT_SECRET,
    { expiresIn: '1d', issuer: 'anulok', audience: 'anulok-customer' }
  );
};

export const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Access token missing or invalid' });
  }

  const token = authHeader.split(' ')[1];
  let decoded;
  try {
    decoded = jwt.verify(token, JWT_SECRET, {
      issuer: 'anulok',
      audience: 'anulok-customer'
    });
  } catch {
    return res.status(401).json({ error: 'Token has expired or is invalid' });
  }

  try {
    const user = await db.getUserById(decoded.sub);
    if (!user) return res.status(401).json({ error: 'User not found or deleted' });
    req.user = { id: user.id, email: user.email, phone: user.phone, role: user.role, name: user.name };
    return next();
  } catch (error) {
    return next(error);
  }
};

export const optionalAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next();
  }
  const token = authHeader.split(' ')[1];
  let decoded;
  try {
    decoded = jwt.verify(token, JWT_SECRET, {
      issuer: 'anulok',
      audience: 'anulok-customer'
    });
  } catch {
    return next();
  }

  try {
    const user = await db.getUserById(decoded.sub);
    if (user) {
      req.user = { id: user.id, email: user.email, role: user.role, name: user.name };
    }
    return next();
  } catch (error) {
    return next(error);
  }
};

export const requireAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Forbidden: Admin privileges required' });
  }
  next();
};
