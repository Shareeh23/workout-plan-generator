const mongoose = require('mongoose');
const exerciseSchema = require('./exerciseSchema');

// Create a copy of exerciseSchema without _id
const exerciseSchemaNoId = exerciseSchema.clone();
exerciseSchemaNoId.remove('_id');

const workoutSessionSchema = new mongoose.Schema({
  sessionOrder: { type: Number, required: true },
  focusAreas: [{ type: String }],
  exercises: [exerciseSchemaNoId],
  notes: { type: String }
}, { _id: false });

module.exports = workoutSessionSchema;
