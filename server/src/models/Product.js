import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true, index: true },
  name: { type: String, required: true },
  slug: { type: String, required: true, index: true },
  category: { type: String, required: true },
  categoryName: String,
  price: { type: Number, required: true },
  discountPrice: Number,
  discountPercentage: Number,
  images: { type: [String], default: [] },
  colors: { type: [mongoose.Schema.Types.Mixed], default: [] },
  tags: { type: [String], default: [] },
  featured: { type: Boolean, default: false },
  stock: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
}, { strict: false, versionKey: false });

export const Product = mongoose.models.Product || mongoose.model('Product', productSchema);
