const { validationResult } = require('express-validator');
const User = require('../models/user');
const calorieCalculator = require('../services/calorieCalculator');
const macroCalculator = require('../services/macroCalculator');

// Create or update nutrition profile
exports.createNutritionProfile = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Validation failed');
    error.statusCode = 422;
    error.data = errors.array();
    throw error;
  }

  try {
    const { goal, height, currentWeight, calorieTarget, macroTarget } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { nutritionProfile: { goal, height, currentWeight, calorieTarget, macroTarget } },
      { new: true }
    );
    
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

// Get nutrition profile
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

// Update nutrition profile
exports.updateNutritionProfile = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Validation failed');
    error.statusCode = 422;
    error.data = errors.array();
    throw error;
  }

  try {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['goal', 'height', 'currentWeight', 'calorieTarget', 'macroTarget'];
    const isValidOperation = updates.every(update => allowedUpdates.includes(update));

    if (!isValidOperation) {
      const error = new Error('Invalid updates!');
      error.statusCode = 400;
      throw error;
    }

    const user = await User.findById(req.user._id);
    
    if (!user.nutritionProfile) {
      const error = new Error('Nutrition profile not found. Create one first.');
      error.statusCode = 404;
      throw error;
    }

    updates.forEach(update => {
      user.nutritionProfile[update] = req.body[update];
    });

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
exports.nutritionMetrics = async (req, res, next) => {
  try {
    const { height, weight, age, gender, activityLevel, goal = 'maintain' } = req.body;
    
    const bmr = calorieCalculator.calculateBMR(gender, weight, height, age);
    const tdee = calorieCalculator.calculateDailyCalories(gender, weight, height, age, activityLevel);
    const calorieTarget = calorieCalculator.calculateDailyCalories(gender, weight, height, age, activityLevel, goal);
    
    // Save to user's nutrition profile
    const user = await User.findByIdAndUpdate(
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
          calorieTarget
        }
      },
      { new: true }
    );
    
    res.status(200).json({
      success: true,
      data: { bmr, tdee, calorieTarget }
    });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

// Macro calculation
exports.calculateMacros = async (req, res, next) => {
  try {
    const { calories, split = '40-30-30' } = req.body;
    
    const macros = macroCalculator.calculateMacros(calories, split);
    
    // Save to user's nutrition profile
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { 
        nutritionProfile: {
          ...req.user.nutritionProfile,
          calorieTarget: calories,
          macroTarget: macros,
          macroSplit: split
        }
      },
      { new: true }
    );
    
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
