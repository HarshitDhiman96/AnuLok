import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true, index: true },
  name: { type: String, required: true, trim: true, maxlength: 100 },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    unique: true,
    maxlength: 254,
    match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Enter a valid email address']
  },
  phone: { type: String, required: true, unique: true, trim: true },
  passwordHash: { type: String, required: true, select: false },
  age: {
    type: Number,
    min: 1,
    max: 120,
    required() { return this.role === 'customer'; }
  },
  gender: {
    type: String,
    enum: ['female', 'male', 'other', 'non-binary', 'prefer-not-to-say'],
    required() { return this.role === 'customer'; }
  },
  address: {
    type: String,
    trim: true,
    maxlength: 300,
    default: ''
  },
  role: { type: String, enum: ['customer', 'admin'], default: 'customer' },
  createdAt: { type: Date, default: Date.now }
}, { timestamps: false });

userSchema.set('toJSON', {
  transform(_document, result) {
    delete result._id;
    delete result.__v;
    delete result.passwordHash;
    return result;
  }
});

export const User = mongoose.models.User || mongoose.model('User', userSchema);
