const express = require('express');
const { body } = require('express-validator');
const adminController = require('../controllers/admin');
const isAdmin = require('../middleware/is-admin');

const router = express.Router();

// User management
router.get('/users', isAdmin, adminController.getUsers);

// Predefined workout plan management
router.post(
  '/plans',
  isAdmin,
  [
    // Core fields
    body('planName')
      .trim()
      .notEmpty()
      .withMessage('Plan name is required')
      .isLength({ max: 100 })
      .withMessage('Plan name cannot exceed 100 characters'),
    body('programTheme')
      .trim()
      .notEmpty()
      .withMessage('Program theme is required'),
    body('trainingDays')
      .isInt({ min: 3, max: 6 })
      .withMessage('Must specify 3-6 training days'),

    // Muscle groups
    body('prioritizedMuscles')
      .isArray({ min: 1 })
      .withMessage('At least 1 prioritized muscle group required'),
    body('neutralPoints')
      .optional()
      .isArray()
      .withMessage('Neutral points must be an array'),
    body('weakPoints')
      .optional()
      .isArray()
      .withMessage('Weak points must be an array'),

    // Sessions validation
    body('sessions')
      .isArray({ min: 1 })
      .withMessage('At least 1 training session required'),
    body('sessions.*.exercises')
      .isArray({ min: 1 })
      .withMessage('Each session must contain at least 1 exercise'),
    body('sessions.*.exercises.*.name')
      .trim()
      .notEmpty()
      .withMessage('Exercise name is required'),
    body('sessions.*.exercises.*.sets')
      .isInt({ min: 1 })
      .withMessage('Minimum 1 set required'),
    body('sessions.*.exercises.*.reps')
      .isInt({ min: 1 })
      .withMessage('Minimum 1 rep required'),
  ],
  adminController.createPlan
);

router.get('/plans', isAdmin, adminController.getPlans);

router.put(
  '/plans/:id',
  isAdmin,
  [
    body('planName')
      .optional()
      .trim()
      .notEmpty()
      .withMessage('Plan name cannot be empty')
      .isLength({ max: 100 })
      .withMessage('Plan name cannot exceed 100 characters'),
    body('programTheme')
      .optional()
      .trim()
      .notEmpty()
      .withMessage('Program theme cannot be empty'),
    body('trainingDays')
      .optional()
      .isInt({ min: 3, max: 6 })
      .withMessage('Must specify 3-6 training days'),
    body('prioritizedMuscles')
      .optional()
      .isArray({ min: 1 })
      .withMessage('At least 1 prioritized muscle group required'),
    body('sessions')
      .optional()
      .isArray({ min: 1 })
      .withMessage('At least 1 training session required'),
    body('sessions.*.exercises')
      .optional()
      .isArray({ min: 1 })
      .withMessage('Each session must contain at least 1 exercise'),
  ],
  adminController.updatePlan
);

router.delete('/plans/:id', isAdmin, adminController.deletePlan);

// Audit logs
router.get('/audit-logs', isAdmin, adminController.getAuditLogs);

module.exports = router;
