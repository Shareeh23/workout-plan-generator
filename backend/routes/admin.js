const express = require('express');
const { body } = require('express-validator');
const adminController = require('../controllers/admin');
const isAuth = require('../middleware/is-auth');
const isAdmin = require('../middleware/is-admin');
const upload = require('../utils/fileUpload');

const router = express.Router();

const parsePlanData = (req, res, next) => {
  if (req.body.planData) {
    try {
      const planData = JSON.parse(req.body.planData);
      // Merge the parsed data into req.body
      req.body = { ...req.body, ...planData };
    } catch (error) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid planData format'
      });
    }
  }
  next();
};

router.get('/users', isAuth, isAdmin, adminController.getUsers);

router.post(
  '/plans',
  isAuth,
  isAdmin,
  upload.single('image'),
  parsePlanData,
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
      body('sessions.*.exercises.*.repRange')
      .isString()
      .trim()
      .notEmpty()
      .withMessage('Rep Range is required')
      .custom((value) => {
        // Check if it's a single number or a range (e.g., "8" or "8-12")
        const isValid = /^\d+$/.test(value) || /^\d+\s*-\s*\d+$/.test(value);
        if (!isValid) {
          throw new Error('Invalid rep format. Use a number (e.g., "8") or a range (e.g., "8-12")');
        }
        return true;
      }),
  ],
  adminController.createPlan
);

router.get('/plans', isAuth, isAdmin, adminController.getPlans);

router.put(
  '/plans/:id',
  isAuth,
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

router.delete('/plans/:id', isAuth, isAdmin, adminController.deletePlan);

// Audit logs
router.get('/audit-logs', isAuth, isAdmin, adminController.getAuditLogs);

module.exports = router;
