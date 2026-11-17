import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true, index: true },
  slug: { type: String, required: true, index: true },
  name: { type: String, required: true },
  description: { type: String, default: '' },
  image: { type: String, default: '' },
  itemCount: { type: Number, default: 0 },
  featured: { type: Boolean, default: false }
}, { strict: false, versionKey: false });

export const Category = mongoose.models.Category || mongoose.model('Category', categorySchema);
