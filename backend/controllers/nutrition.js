const { validationResult } = require('express-validator');
const User = require('../models/user');

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
