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
        message: 'Invalid planData format',
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
    body('imageUrl')
      .optional() // Make it optional in case the file is being uploaded via multer
      .isString()
      .withMessage('Image URL must be a string'),

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
        // Check if it's a single number, a range, AMRAP, or a distance
        const isSingleNumber = /^\d+$/.test(value);
        const isRange = /^\d+\s*-\s*\d+$/.test(value);
        const isAmrap = value.toUpperCase() === 'AMRAP';
        const isDistance = /^\d+\s*(m|meters?)$/i.test(value);
        const isRangeWithSeconds = /^\d+\s*-\s*\d+\s*(s|sec)$/i.test(value);
        const isSingleNumberWithSeconds = /^\d+\s*(s|sec)$/i.test(value);

        if (
          !isSingleNumber &&
          !isRange &&
          !isAmrap &&
          !isDistance &&
          !isRangeWithSeconds &&
          !isSingleNumberWithSeconds
        ) {
          throw new Error(
            'Invalid format. Use: "8", "8-12", "AMRAP", "50m", "30s", "30sec", or "30-60s"'
          );
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
