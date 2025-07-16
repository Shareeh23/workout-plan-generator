const express = require('express');
const { body } = require('express-validator');
const nutritionController = require('../controllers/nutrition');
const isAuth = require('../middleware/is-auth');

const router = express.Router();

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
