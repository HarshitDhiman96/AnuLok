import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true, index: true }
}, { strict: false, versionKey: false });

export const Review = mongoose.models.Review || mongoose.model('Review', reviewSchema);
