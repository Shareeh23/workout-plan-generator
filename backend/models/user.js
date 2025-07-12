const mongoose = require('mongoose');
const { Schema } = mongoose;
const workoutPlanSchema = require('./workoutPlanSchema');
const nutritionProfileSchema = require('./nutritionProfileSchema');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: { type: String },
  googleId: { type: String },
  workoutPlan: workoutPlanSchema,
  workoutHistory: [
    {
      planRef: { 
        type: mongoose.Schema.Types.ObjectId,
        required: true 
      },
      planName: { type: String },
      createdAt: { type: Date, default: Date.now },
      completedAt: { type: Date },
      programTheme: { type: String }
    },
  ],
  nutritionProfile: {
    type: nutritionProfileSchema,
    required: false
  },
  isAdmin: {
    type: Boolean,
    default: false
  }
});

module.exports = mongoose.model('User', userSchema);