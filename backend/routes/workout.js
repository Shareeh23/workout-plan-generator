const express = require('express');
const { body } = require('express-validator');
const isAuth = require('../middlewares/is-auth');
const workoutController = require('../controllers/workout.js');

const router = express.Router();

router.post(
  '/generate',
  isAuth,
  [
    body('archetype').notEmpty().withMessage('Archetype is required'),
    body('trainingDays')
      .isInt({ min: 3, max: 6 })
      .withMessage('Training days must be between 3 and 6')
  ],
  workoutController.generatePlan
);

// Calculator routes
router.post(
  '/calculate/calories',
  isAuth,
  [
    body('gender').isIn(['male', 'female']),
    body('weight').isFloat({ min: 30, max: 300 }),
    body('height').isFloat({ min: 100, max: 250 }),
    body('age').isInt({ min: 13, max: 120 }),
    body('activityLevel').isIn(['sedentary', 'light', 'moderate', 'active', 'veryActive'])
  ],
  workoutController.calculateCalories
);

router.post(
  '/calculate/macros',
  isAuth,
  [
    body('calories').isInt({ min: 1000, max: 10000 }),
    body('goal').optional().isIn(['maintenance', 'muscleGain', 'fatLoss'])
  ],
  workoutController.calculateMacros
);

router.post(
  '/calculate/onerepmax',
  isAuth,
  [
    body('weight').isFloat({ min: 20, max: 500 }),
    body('reps').isInt({ min: 1, max: 10 })
  ],
  workoutController.calculateOneRepMax
);

module.exports = router;