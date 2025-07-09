const express = require('express');
const { body } = require('express-validator');
const isAuth = require('../middleware/is-auth');
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