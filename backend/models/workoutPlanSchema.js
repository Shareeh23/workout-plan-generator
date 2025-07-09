const mongoose = require('mongoose');
const workoutSessionSchema = require('./workoutSessionSchema');

const workoutPlanSchema = new mongoose.Schema({
  planId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PredefinedWorkoutPlan',
  },
  source: { type: String, enum: ['ai', 'predefined'], required: true },
  createdAt: { type: Date, default: Date.now },
  name: { type: String },
  description: { type: String },
  prioritizedMuscles: [String],
  trainingDaysPerWeek: { type: Number, required: true },
  sessions: [workoutSessionSchema],
  isActive: { type: Boolean, default: false },
});

module.exports = workoutPlanSchema; 
