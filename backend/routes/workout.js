const express = require('express');
const { body, query, param } = require('express-validator');
const isAuth = require('../middleware/is-auth');
const workoutController = require('../controllers/workout.js');

const router = express.Router();

router.post(
  '/generate',
  isAuth,
  [
    body('archetype')
      .notEmpty()
      .withMessage('Character archetype is required')
      .isString()
      .withMessage('Archetype must be a string')
      .isLength({ max: 50 })
      .withMessage('Archetype cannot exceed 50 characters'),
    body('trainingDays')
      .notEmpty()
      .withMessage('Training days is required')
      .isInt({ min: 3, max: 6 })
      .withMessage('Must specify 3-6 training days'),
  ],
  workoutController.generateWorkoutPlan
);

router.post(
  '/calculate/onerepmax',
  isAuth,
  [
    body('weight')
      .isFloat({ min: 20, max: 500 })
      .withMessage('Weight must be between 20-500 lbs/kg'),
    body('reps')
      .isInt({ min: 1, max: 10 })
      .withMessage('Reps must be between 1-10'),
  ],
  workoutController.calculateOneRepMax
);

router.post('/deactivate', isAuth, workoutController.deactivatePlan);

router.get(
  '/planned-exercises',
  isAuth,
  [
    query('sessionOrder')
      .isInt({ min: 1 })
      .withMessage('Valid session order required'),
  ],
  workoutController.getPlannedExercises
);

router.get(
  '/plan/priorities',
  isAuth,
  workoutController.getMuscleGroupPriorities
);

router.get('/plan/summary', isAuth, workoutController.getWorkoutPlanSummary);

router.get('/plan', isAuth, workoutController.getFullWorkoutPlan);

router.get(
  '/plan/sessions/:sessionOrder',
  isAuth,
  [
    param('sessionOrder')
      .isInt({ min: 1 })
      .withMessage('Valid session order required'),
  ],
  workoutController.getWorkoutSession
);

router.get('/predefined-plans', isAuth, workoutController.getPredefinedPlans);

router.post(
  '/predefined/:planId/assign',
  isAuth,
  workoutController.assignPredefinedPlan
);

// TODO: Logs routes should be on their own page

router.get('/logs', isAuth, workoutController.getLogs);

router.post(
  '/logs',
  isAuth,
  [
    body('sessionOrder')
      .optional()
      .isInt({ min: 1 })
      .withMessage('Session order must be at least 1'),
    body('exercises')
      .isArray({ min: 1 })
      .withMessage('At least one exercise required'),
    body('exercises.*.name').notEmpty().withMessage('Exercise name required'),
    body('exercises.*.performedSets')
      .isArray({ min: 1 })
      .withMessage('At least one set required'),
    body('exercises.*.performedSets.*.weight')
      .isFloat({ min: 0 })
      .withMessage('Weight must be positive'),
    body('exercises.*.performedSets.*.reps')
      .isInt({ min: 1 })
      .withMessage('Minimum 1 rep required'),
  ],
  workoutController.logWorkout
);

router.put(
  '/logs/:logId',
  isAuth,
  [
    param('logId').isMongoId().withMessage('Invalid log ID format'),
    body('sessionOrder').optional().isInt({ min: 1 }),
    body('exercises').optional().isArray({ min: 1 }),
    body('exercises.*.name').optional().notEmpty(),
    body('exercises.*.performedSets').optional().isArray({ min: 1 }),
    body('exercises.*.performedSets.*.reps').optional().isInt({ min: 1 }),
    body('exercises.*.performedSets.*.weight').optional().isFloat({ min: 0 }),
  ],
  workoutController.updateLog
);

module.exports = router;
