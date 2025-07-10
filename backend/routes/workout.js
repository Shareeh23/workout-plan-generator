const express = require('express');
const { body, query, param } = require('express-validator');
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
      .withMessage('Training days must be between 3 and 6'),
  ],
  workoutController.generatePlan
);

router.post(
  '/calculate/onerepmax',
  isAuth,
  [
    body('weight').isFloat({ min: 20, max: 500 }),
    body('reps').isInt({ min: 1, max: 10 }),
  ],
  workoutController.calculateOneRepMax
);

router.post('/deactivate', isAuth, workoutController.deactivatePlan);

router.post('/logs',
  isAuth,
  [
    body('sessionOrder').optional().isInt({ min: 1 }),
    body('exercises').isArray({ min: 1 }).withMessage('At least one exercise required'),
    body('exercises.*.name').notEmpty().withMessage('Exercise name required'),
    body('exercises.*.performedSets').isArray({ min: 1 }).withMessage('At least one set required'),
    body('exercises.*.performedSets.*.reps').isInt({ min: 1 }).withMessage('Reps must be positive integer'),
    body('exercises.*.performedSets.*.weight').isFloat({ min: 0 }).withMessage('Weight must be positive number')
  ],
  workoutController.createLog
);

router.get('/logs', isAuth, workoutController.getLogs);

router.put('/logs/:logId',
  isAuth,
  [
    body('sessionOrder').optional().isInt({ min: 1 }),
    body('exercises').optional().isArray({ min: 1 }),
    body('exercises.*.name').optional().notEmpty(),
    body('exercises.*.performedSets').optional().isArray({ min: 1 }),
    body('exercises.*.performedSets.*.reps').optional().isInt({ min: 1 }),
    body('exercises.*.performedSets.*.weight').optional().isFloat({ min: 0 })
  ],
  workoutController.updateLog
);

router.get('/planned-exercises', 
  isAuth,
  [
    query('sessionOrder')
      .isInt({ min: 1 })
      .withMessage('Valid session order required')
  ],
  workoutController.getPlannedExercises
);

router.get('/plan/priorities', 
  isAuth,
  workoutController.getMuscleGroupPriorities
);

router.get('/plan/summary',
  isAuth,
  workoutController.getWorkoutPlanSummary
);

router.get('/plan', 
  isAuth,
  workoutController.getFullWorkoutPlan
);

router.get('/plan/sessions/:sessionOrder',
  isAuth,
  [
    param('sessionOrder')
      .isInt({ min: 1 })
      .withMessage('Valid session order required')
  ],
  workoutController.getWorkoutSession
);

module.exports = router;
