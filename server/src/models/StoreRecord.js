import mongoose from 'mongoose';

const storeRecordSchema = new mongoose.Schema({
  kind: {
    type: String,
    required: true,
    enum: ['products', 'categories', 'coupons', 'orders', 'reviews']
  },
  id: { type: String, required: true },
  data: { type: mongoose.Schema.Types.Mixed, required: true }
}, { timestamps: false });

storeRecordSchema.index({ kind: 1, id: 1 }, { unique: true });

export const StoreRecord = mongoose.models.StoreRecord ||
  mongoose.model('StoreRecord', storeRecordSchema);
