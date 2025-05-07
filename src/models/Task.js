import mongoose from 'mongoose';

const TaskSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    goal: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Goal',
      required: true,
    },
    title: {
      type: String,
      required: [true, 'Please provide a task title'],
      trim: true,
      maxlength: [100, 'Title cannot be more than 100 characters'],
    },
    description: {
      type: String,
      maxlength: [500, 'Description cannot be more than 500 characters'],
    },
    status: {
      type: String,
      enum: ['Not Started', 'In Progress', 'Completed', 'Deferred'],
      default: 'Not Started',
    },
    priority: {
      type: String,
      enum: ['Low', 'Medium', 'High'],
      default: 'Medium',
    },
    dueDate: {
      type: Date,
      required: [true, 'Please specify a due date'],
    },
    completedDate: {
      type: Date,
    },
    weekNumber: {
      type: Number,
      required: true,
    },
    yearNumber: {
      type: Number,
      required: true,
    },
    // For recurring tasks
    recurring: {
      type: Boolean,
      default: false,
    },
    recurrencePattern: {
      type: String,
      enum: ['Daily', 'Weekly', 'Monthly', 'None'],
      default: 'None',
    },
    estimatedTimeMinutes: {
      type: Number,
      default: 0, // 0 means no estimate
    },
    actualTimeMinutes: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Pre-save hook to set week and year automatically from dueDate if not provided
TaskSchema.pre('save', function(next) {
  if (this.dueDate && (!this.weekNumber || !this.yearNumber)) {
    const date = new Date(this.dueDate);
    // Calculate week number - Jan 1st is in week 1
    const startOfYear = new Date(date.getFullYear(), 0, 1);
    const days = Math.floor((date - startOfYear) / (24 * 60 * 60 * 1000));
    this.weekNumber = Math.ceil((days + startOfYear.getDay() + 1) / 7);
    this.yearNumber = date.getFullYear();
  }
  next();
});

// Create compound index for user-week-year queries
TaskSchema.index({ user: 1, weekNumber: 1, yearNumber: 1 });
// Create compound index for user-goal queries
TaskSchema.index({ user: 1, goal: 1 });
// Create compound index for status-dueDate queries
TaskSchema.index({ user: 1, status: 1, dueDate: 1 });

export default mongoose.models.Task || mongoose.model('Task', TaskSchema); 