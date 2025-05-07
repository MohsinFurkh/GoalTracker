import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a name'],
      maxlength: [60, 'Name cannot be more than 60 characters'],
    },
    email: {
      type: String,
      required: [true, 'Please provide an email address'],
      unique: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address'],
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: [8, 'Password must be at least 8 characters'],
      select: false, // don't return password by default
    },
    timezone: {
      type: String,
      default: 'UTC',
    },
    notificationPreferences: {
      email: {
        weeklyReview: { type: Boolean, default: true },
        taskReminders: { type: Boolean, default: true },
        journalReminders: { type: Boolean, default: false },
      },
      inApp: {
        weeklyReview: { type: Boolean, default: true },
        taskReminders: { type: Boolean, default: true },
        journalReminders: { type: Boolean, default: true },
      },
    },
    image: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }
  
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Method to check if password matches
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.models.User || mongoose.model('User', UserSchema); 