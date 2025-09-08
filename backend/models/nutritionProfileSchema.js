const mongoose = require('mongoose');

const nutritionProfileSchema = new mongoose.Schema(
  {
    goal: {
      type: String,
      enum: ['maintain', 'lose', 'gain'],
      required: true,
    },
    height: { type: Number, required: true }, // in cm
    currentWeight: { type: Number, required: true }, // in kg
    targetWeight: { type: Number }, // in kg
    age: { type: Number, required: true },
    gender: {
      type: String,
      enum: ['male', 'female', 'other'],
      required: true,
    },
    activityLevel: {
      type: String,
      enum: ['sedentary', 'light', 'moderate', 'active', 'very_active'],
      required: true,
    },
    // Calculated fields
    bmr: { type: Number }, // Basal Metabolic Rate
    tdee: { type: Number }, // Total Daily Energy Expenditure
    calorieTarget: { type: Number }, // Calculated based on goal
    macroTarget: {
      macroSplit: {
        type: String,
        enum: ['40-30-30', '50-25-25', '60-20-20'],
        required: true,
      },
      carbs: { type: Number },
      fat: { type: Number },
      protein: { type: Number },
    },
  },
  { _id: false }
);

module.exports = nutritionProfileSchema;
