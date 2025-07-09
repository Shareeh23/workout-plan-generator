const express = require('express');
const { body } = require('express-validator');
const nutritionController = require('../controllers/nutrition');
const isAuth = require('../middleware/is-auth');

const router = express.Router();

// Calculator endpoints
router.post(
  '/nutrition-metrics',
  isAuth,
  [
    body('height').isFloat({ min: 100, max: 250 }),
    body('weight').isFloat({ min: 30, max: 300 }),
    body('age').isInt({ min: 13, max: 120 }),
    body('gender').isIn(['male', 'female', 'other']),
    body('activityLevel').isIn(['sedentary', 'light', 'moderate', 'active', 'very_active']),
    body('goal').optional().isIn(['maintain', 'lose', 'gain'])
  ],
  nutritionController.nutritionMetrics
);

router.post(
  '/calculate-macros',
  isAuth,
  [
    body('calories').isInt({ min: 1000, max: 10000 }),
    body('split').optional().isIn(['40-30-30', '50-25-25', '30-40-30'])
  ],
  nutritionController.calculateMacros
);

// Create nutrition profile
router.post(
  '/create-profile',
  isAuth,
  [
    body('goal').isIn(['maintain', 'lose', 'gain']),
    body('height').isFloat({ gt: 0 }),
    body('currentWeight').isFloat({ gt: 0 }),
    body('calorieTarget').isFloat({ gt: 0 }),
    body('macroTarget.macroSplit').isIn(['40-30-30', '50-25-25', '30-40-30']),
    body('macroTarget.protein').isFloat({ gt: 0 }),
    body('macroTarget.carbs').isFloat({ gt: 0 }),
    body('macroTarget.fat').isFloat({ gt: 0 })
  ],
  nutritionController.createNutritionProfile
);

// Update nutrition profile
router.patch(
  '/update-profile',
  isAuth,
  [
    body('goal').optional().isIn(['maintain', 'lose', 'gain']),
    body('height').optional().isFloat({ gt: 0 }),
    body('currentWeight').optional().isFloat({ gt: 0 }),
    body('calorieTarget').optional().isFloat({ gt: 0 }),
    body('macroTarget.macroSplit').optional().isIn(['40-30-30', '50-25-25', '30-40-30']),
    body('macroTarget.protein').optional().isFloat({ gt: 0 }),
    body('macroTarget.carbs').optional().isFloat({ gt: 0 }),
    body('macroTarget.fat').optional().isFloat({ gt: 0 })
  ],
  nutritionController.updateNutritionProfile
);

// Get nutrition profile
router.get('/get-profile', isAuth, nutritionController.getNutritionProfile);

module.exports = router;
