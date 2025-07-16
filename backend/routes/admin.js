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
    body('planName').trim().notEmpty().withMessage('Plan name is required'),
    body('programTheme')
      .trim()
      .notEmpty()
      .withMessage('Program Theme is required'),
    body('trainingDays')
      .isInt({ min: 3, max: 6 })
      .withMessage('3-6 training days required'),

    // Muscle groups
    body('prioritizedMuscles')
      .isArray({ min: 1 })
      .withMessage('At least 1 prioritized muscle required'),
    body('neutralPoints').optional().isArray(),
    body('weakPoints').optional().isArray(),

    // Sessions validation
    body('sessions')
      .isArray({ min: 1 })
      .withMessage('At least 1 session required'),
    body('sessions.*.exercises')
      .isArray({ min: 1 })
      .withMessage('Each session needs exercises'),
    body('sessions.*.exercises.*.name').trim().notEmpty(),
    body('sessions.*.exercises.*.sets').isInt({ min: 1 }),
    body('sessions.*.exercises.*.reps').isInt({ min: 1 }),
  ],
  adminController.createPlan
);

router.get('/plans', isAdmin, adminController.getPlans);

router.put(
  '/plans/:id',
  isAdmin,
  [
    // Same as create but all optional
    body('planName').optional().trim().notEmpty(),
    body('programTheme').optional().trim().notEmpty(),
    body('trainingDays').optional().isInt({ min: 3, max: 6 }),
    body('prioritizedMuscles').optional().isArray({ min: 1 }),
    body('sessions').optional().isArray({ min: 1 }),
    body('sessions.*.exercises').optional().isArray({ min: 1 }),
  ],
  adminController.updatePlan
);

router.delete('/plans/:id', isAdmin, adminController.deletePlan);

// Audit logs
router.get('/audit-logs', isAdmin, adminController.getAuditLogs);

module.exports = router;