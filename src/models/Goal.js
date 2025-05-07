import mongoose from 'mongoose';

const GoalSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: [true, 'Please provide a goal title'],
      trim: true,
      maxlength: [100, 'Title cannot be more than 100 characters'],
    },
    description: {
      type: String,
      maxlength: [500, 'Description cannot be more than 500 characters'],
    },
    category: {
      type: String,
      enum: ['Personal', 'Work', 'Health', 'Financial', 'Education', 'Other'],
      default: 'Personal',
    },
    status: {
      type: String,
      enum: ['Not Started', 'In Progress', 'Completed', 'On Hold', 'Abandoned'],
      default: 'Not Started',
    },
    targetDate: {
      type: Date,
    },
    completedDate: {
      type: Date,
    },
    priority: {
      type: String,
      enum: ['Low', 'Medium', 'High'],
      default: 'Medium',
    },
    progressMetric: {
      type: String,
      enum: ['Percentage', 'Count', 'Binary'],
      default: 'Percentage',
    },
    targetValue: {
      type: Number,
      default: 100,
    },
    currentValue: {
      type: Number,
      default: 0,
    },
    color: {
      type: String,
      default: '#1976d2', // Default blue color
    },
    archived: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Virtual for calculating progress percentage
GoalSchema.virtual('progressPercentage').get(function () {
  if (this.progressMetric === 'Percentage') {
    return this.currentValue;
  } else if (this.progressMetric === 'Count' && this.targetValue > 0) {
    return Math.min(100, Math.round((this.currentValue / this.targetValue) * 100));
  } else if (this.progressMetric === 'Binary') {
    return this.status === 'Completed' ? 100 : 0;
  }
  return 0;
});

// Set JSON conversion to include virtuals
GoalSchema.set('toJSON', { virtuals: true });
GoalSchema.set('toObject', { virtuals: true });

export default mongoose.models.Goal || mongoose.model('Goal', GoalSchema); 