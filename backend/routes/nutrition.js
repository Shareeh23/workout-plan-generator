const express = require('express');
const { body } = require('express-validator');
const nutritionController = require('../controllers/nutrition');
const isAuth = require('../middleware/is-auth');


const router = express.Router();

router.get('/get-profile', isAuth, nutritionController.getNutritionProfile);

router.post(
  '/create-profile',
  isAuth,
  [
    body('height')
      .isFloat({ min: 100, max: 250 })
      .withMessage('Height must be between 100cm and 250cm'),
      
    body('weight')
      .isFloat({ min: 30, max: 300 })
      .withMessage('Weight must be between 30kg and 300kg'),
      
    body('age')
      .isInt({ min: 18, max: 120 })
      .withMessage('Age must be between 18 and 120'),
      
    body('gender')
      .isIn(['male', 'female', 'other'])
      .withMessage('Invalid gender. Must be male, female, or other'),
      
    body('activityLevel')
      .isIn(['sedentary', 'light', 'moderate', 'active', 'very_active'])
      .withMessage('Invalid activity level'),
      
    body('goal')
      .optional()
      .isIn(['maintain', 'lose', 'gain'])
      .withMessage('Goal must be maintain, lose, or gain')
      .default('maintain'),
      
    body('macroSplit')
      .optional()
      .isIn(['40-30-30', '50-25-25', '60-20-20'])
      .withMessage('Invalid macro split. Must be 40-30-30, 50-25-25, or 60-20-20')
      .default('40-30-30')
  ],
  nutritionController.createNutritionProfile
);

// Calculate macros based on calories and split
router.post(
  '/calculate-macros',
  isAuth,
  [
    body('calories')
      .isInt({ min: 1000, max: 10000 })
      .withMessage('Calories must be between 1000 and 10000'),
      
    body('split')
      .optional()
      .isIn(['40-30-30', '50-25-25', '60-20-20'])
      .withMessage('Invalid macro split. Must be 40-30-30, 50-25-25, or 60-20-20')
      .default('40-30-30')
  ],
  nutritionController.calculateMacros
);

// Update specific nutrition profile fields
router.patch(
  '/update-profile',
  isAuth,
  [
    // Basic info
    body('height')
      .isFloat({ min: 100, max: 250 })
      .withMessage('Height must be between 100cm and 250cm'),
      
    body('weight')
      .isFloat({ min: 30, max: 150 })
      .withMessage('Weight must be between 30kg and 150kg'),
      
    body('age')
      .isInt({ min: 18, max: 60 })
      .withMessage('Age must be between 18 and 60'),
      
    body('gender')
      .isIn(['male', 'female', 'other'])
      .withMessage('Invalid gender. Must be male, female, or other'),
      
    body('activityLevel')
      .isIn(['sedentary', 'light', 'moderate', 'active', 'very_active'])
      .withMessage('Invalid activity level'),
      
    body('goal')
      .optional()
      .isIn(['maintain', 'lose', 'gain'])
      .withMessage('Goal must be maintain, lose, or gain')
      .default('maintain'),
      
    body('macroSplit')
      .optional()
      .isIn(['40-30-30', '50-25-25', '60-20-20'])
      .withMessage('Invalid macro split. Must be 40-30-30, 50-25-25, or 60-20-20')
      .default('40-30-30')
  ],
  nutritionController.updateNutritionProfile
);

module.exports = router;