const mongoose = require('mongoose');
const exerciseSchema = require('./exerciseSchema');

const workoutSessionSchema = new mongoose.Schema({
  sessionOrder: { type: Number, required: true },
  focusArea: { type: String }, // e.g. 'Chest & Triceps'
  exercises: [exerciseSchema],
  notes: { type: String },
});

module.exports = workoutSessionSchema;
