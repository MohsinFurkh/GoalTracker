import mongoose from 'mongoose';

const JournalSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: [true, 'Please provide a journal title'],
      trim: true,
      maxlength: [100, 'Title cannot be more than 100 characters'],
    },
    content: {
      type: String,
      required: [true, 'Please provide journal content'],
    },
    entryType: {
      type: String,
      enum: ['Daily', 'Weekly', 'Reflection', 'Note'],
      default: 'Daily',
    },
    mood: {
      type: String,
      enum: ['Very Negative', 'Negative', 'Neutral', 'Positive', 'Very Positive'],
      default: 'Neutral',
    },
    tags: [{
      type: String,
      trim: true,
    }],
    relatedGoals: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Goal',
    }],
    relatedTasks: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Task',
    }],
    weekNumber: {
      type: Number,
    },
    yearNumber: {
      type: Number,
    },
    isPrivate: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Pre-save hook to set week and year automatically from creation date
JournalSchema.pre('save', function(next) {
  if (!this.weekNumber || !this.yearNumber) {
    const date = this.createdAt || new Date();
    // Calculate week number - Jan 1st is in week 1
    const startOfYear = new Date(date.getFullYear(), 0, 1);
    const days = Math.floor((date - startOfYear) / (24 * 60 * 60 * 1000));
    this.weekNumber = Math.ceil((days + startOfYear.getDay() + 1) / 7);
    this.yearNumber = date.getFullYear();
  }
  next();
});

// Create compound index for user and createdAt
JournalSchema.index({ user: 1, createdAt: -1 });
// Create compound index for user, tags, and createdAt
JournalSchema.index({ user: 1, tags: 1, createdAt: -1 });
// Create compound index for user, relatedGoals, and createdAt
JournalSchema.index({ user: 1, 'relatedGoals': 1, createdAt: -1 });
// Create compound index for user, week, and year
JournalSchema.index({ user: 1, weekNumber: 1, yearNumber: 1 });

export default mongoose.models.Journal || mongoose.model('Journal', JournalSchema); 