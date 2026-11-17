import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true, index: true },
  userId: { type: String, default: null, index: true },
  customer: { type: mongoose.Schema.Types.Mixed, required: true },
  items: { type: [mongoose.Schema.Types.Mixed], default: [] },
  subtotal: Number,
  discount: Number,
  couponCode: String,
  deliveryCharge: Number,
  tax: Number,
  total: Number,
  paymentMethod: String,
  paymentStatus: String,
  orderStatus: { type: String, default: 'Confirmed', index: true },
  createdAt: { type: Date, default: Date.now }
}, { strict: false, versionKey: false });

export const Order = mongoose.models.Order || mongoose.model('Order', orderSchema);
