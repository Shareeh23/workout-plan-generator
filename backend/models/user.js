const mongoose = require('mongoose');
const { Schema } = mongoose;
const workoutPlanSchema = require('./workoutPlanSchema');
const nutritionProfileSchema = require('./nutritionProfileSchema');

const userSchema = new Schema({
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
      plan: workoutPlanSchema,
      completedAt: Date,
    },
  ],
  nutritionProfile: {
    type: nutritionProfileSchema,
    required: false
  }
});

module.exports = mongoose.model('User', userSchema);