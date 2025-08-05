const mongoose = require('mongoose');
const workoutSessionSchema = require('./workoutSessionSchema');

// Create a copy of session schema without _id
const sessionSchemaNoId = workoutSessionSchema.clone();
sessionSchemaNoId.remove('_id');

const workoutPlanSchema = new mongoose.Schema({
  source: {
    type: String,
    enum: ['ai', 'predefined'],
    required: true,
  },
  planName: {
    type: String,
    required: true,
  },
  programTheme: {
    type: String,
    required: true,
  },
  /* imageUrl: {
    type: String,
    required: true,
  }, */
  prioritizedMuscles: {
    type: [String],
    required: true,
  },
  neutralPoints: {
    type: [String],
    required: true,
  },
  weakPoints: {
    type: [String],
    required: true,
  },
  trainingDays: {
    type: Number,
    required: true,
  },
  sessions: {
    type: [sessionSchemaNoId],
    required: true,
  },
  isActive: {
    type: Boolean,
    default: false,
  },
  metadata: {
    type: {
      lastModified: Date,
      createdBy: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User',
        required: function() { return this.source === 'predefined' }
      },
      requestParams: {
        planName: String,
        trainingDays: Number
      },
    },
    default: {}
  },
}, { timestamps: true });

module.exports = workoutPlanSchema;
