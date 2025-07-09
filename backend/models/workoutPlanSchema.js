const mongoose = require('mongoose');
const workoutSessionSchema = require('./workoutSessionSchema');

// Create a copy of session schema without _id
const sessionSchemaNoId = workoutSessionSchema.clone();
sessionSchemaNoId.remove('_id');

const workoutPlanSchema = new mongoose.Schema({
  source: { type: String, enum: ['ai', 'predefined'], required: true },
  createdAt: { type: Date, default: Date.now },
  planName: { type: String },
  programTheme: { type: String },
  prioritizedMuscles: [String],
  neutralPoints: [String],
  weakPoints: [String],
  trainingDays: { type: Number, required: true },
  sessions: [sessionSchemaNoId],
  isActive: { type: Boolean, default: false }
});

module.exports = workoutPlanSchema;
