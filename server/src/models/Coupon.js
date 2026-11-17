import mongoose from 'mongoose';

const couponSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true, index: true },
  code: { type: String, required: true, uppercase: true, index: true },
  name: String,
  discountType: String,
  discountValue: Number,
  minimumOrder: Number,
  maximumDiscount: Number,
  startDate: String,
  expiryDate: String,
  usageLimit: Number,
  usageCount: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true }
}, { strict: false, versionKey: false });

export const Coupon = mongoose.models.Coupon || mongoose.model('Coupon', couponSchema);
