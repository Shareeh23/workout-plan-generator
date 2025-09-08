const { validationResult } = require('express-validator');
const User = require('../models/user');
const calorieCalculator = require('../services/calorieCalculator');
const macroCalculator = require('../services/macroCalculator');

exports.getNutritionProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    
    if (!user.nutritionProfile) {
      const error = new Error('Nutrition profile not found');
      error.statusCode = 404;
      throw error;
    }
    
    res.status(200).json({
      success: true,
      data: user.nutritionProfile
    });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

exports.updateNutritionProfile = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Validation failed');
    error.statusCode = 422;
    error.data = errors.array();
    throw error;
  }

  try {
    const { height, weight, age, gender, activityLevel, goal = 'maintain', macroSplit = '40-30-30' } = req.body;
    
    // Recalculate all metrics
    const bmr = calorieCalculator.calculateBMR(gender, weight, height, age);
    const tdee = calorieCalculator.calculateDailyCalories(gender, weight, height, age, activityLevel);
    const calorieTarget = calorieCalculator.calculateDailyCalories(gender, weight, height, age, activityLevel, goal);
    const macros = macroCalculator.calculateMacros(calorieTarget, macroSplit);

    const user = await User.findById(req.user._id);
    
    if (!user.nutritionProfile) {
      const error = new Error('Nutrition profile not found. Create one first.');
      error.statusCode = 404;
      throw error;
    }

    // Update all fields
    user.nutritionProfile = {
      ...user.nutritionProfile,
      height,
      currentWeight: weight,
      age,
      gender,
      activityLevel,
      goal,
      bmr,
      tdee,
      calorieTarget,
      macroTarget: {
        ...macros,
        macroSplit
      }
    };

    await user.save();
    
    res.status(200).json({
      success: true,
      data: user.nutritionProfile
    });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

// Calculate and save all nutrition metrics
exports.createNutritionProfile = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Validation failed');
    error.statusCode = 422;
    error.data = errors.array();
    throw error;
  }

  try {
    const { height, weight, age, gender, activityLevel, goal = 'maintain', macroSplit = '40-30-30' } = req.body;
    
    const bmr = calorieCalculator.calculateBMR(gender, weight, height, age);
    const tdee = calorieCalculator.calculateDailyCalories(gender, weight, height, age, activityLevel);
    const calorieTarget = calorieCalculator.calculateDailyCalories(gender, weight, height, age, activityLevel, goal);
    const macros = macroCalculator.calculateMacros(calorieTarget, macroSplit);
    
    await User.findByIdAndUpdate(
      req.user._id,
      { 
        nutritionProfile: {
          ...req.user.nutritionProfile,
          height,
          currentWeight: weight,
          age,
          gender,
          activityLevel,
          goal,
          bmr,
          tdee,
          calorieTarget,
          macroTarget: {
            ...macros,
            macroSplit
          }
        }
      },
      { new: true }
    );
    
    res.status(200).json({
      success: true,
      data: { 
        bmr, 
        tdee, 
        calorieTarget,
        macroTarget: {
          ...macros,
          macroSplit
        }
      }
    });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

// For macro calculator playground - doesn't save to profile
exports.calculateMacros = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Validation failed');
    error.statusCode = 422;
    error.data = errors.array();
    throw error;
  }

  try {
    const { calories, split = '40-30-30' } = req.body;
    
    const macros = macroCalculator.calculateMacros(calories, split);
    
    res.status(200).json({
      success: true,
      data: macros
    });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};
