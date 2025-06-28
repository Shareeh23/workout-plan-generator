const mongoose = require('mongoose');
const { Schema } = mongoose;
const workoutPlanSchema = require('./workoutPlanSchema');

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
});

module.exports = mongoose.model('User', userSchema);
