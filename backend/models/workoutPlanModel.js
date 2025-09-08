const mongoose = require('mongoose');
const workoutPlanSchema = require('./workoutPlanSchema');

// Create and export the model
const WorkoutPlan = mongoose.model('WorkoutPlan', workoutPlanSchema);

module.exports = WorkoutPlan;
