const express = require('express');
const { body } = require('express-validator');
const authController = require('../controllers/auth');
const isAuth = require('../middleware/is-auth');
const passport = require('passport');
const checkEmail = require('../middleware/check-email');
const rejectHtml = require('../middleware/reject-html');

const router = express.Router();

router.get(
  '/signup/google',
  passport.authenticate('google', {
    scope: ['profile', 'email'],
    failureMessage: 'Google authentication failed',
  })
);

router.get(
  '/signup/google/callback',
  passport.authenticate('google', {
    session: false,
    failureRedirect: 'http://localhost:5173/auth-failure?message=Google+login+failed',
    failureMessage: 'Google login failed - please try again',
  }),
  authController.oauthGoogle
);

// TODO: Failure Redirect should be the sign up route

router.put(
  '/signup/local',
  rejectHtml('name'),
  rejectHtml('email'),
  [
    body('email')
      .isString()
      .withMessage('Email must be a string')
      .bail()
      .trim()
      .escape()
      .notEmpty()
      .withMessage('Email is required')
      .bail()
      .isEmail()
      .withMessage('Please enter a valid email address')
      .normalizeEmail(),
    body('password')
      .isString()
      .withMessage('Password must be a string')
      .bail()
      .notEmpty()
      .withMessage('Password is required')
      .bail()
      .isLength({ min: 8 })
      .withMessage('Password must be at least 8 characters long')
      .bail()
      .matches(/[A-Z]/)
      .withMessage('Password must contain at least one uppercase letter')
      .bail()
      .matches(/[a-z]/)
      .withMessage('Password must contain at least one lowercase letter')
      .bail()
      .matches(/[0-9]/)
      .withMessage('Password must contain at least one number')
      .bail()
      .matches(/[^a-zA-Z0-9]/)
      .withMessage('Password must contain at least one special character'),
    body('name')
      .isString()
      .withMessage('Name must be a string')
      .bail()
      .notEmpty()
      .withMessage('Name is required')
      .bail()
      .matches(/^[a-zA-Z0-9 \-'.,]+$/)
      .withMessage('Name contains invalid characters')
      .bail()
      .trim()
      .escape(),
    checkEmail,
  ],
  authController.signup
);

router.put(
  '/login',
  rejectHtml('email'),
  [
    body('email')
      .isString()
      .withMessage('Email must be a string')
      .bail()
      .trim()
      .escape()
      .notEmpty()
      .withMessage('Email is required')
      .bail()
      .isEmail()
      .withMessage('Please enter a valid email address')
      .normalizeEmail(),
    body('password')
      .isString()
      .withMessage('Password must be a string')
      .bail()
      .notEmpty()
      .withMessage('Password is required'),
  ],
  authController.login
);

router.put(
  '/change-password',
  isAuth,
  rejectHtml('currentPassword'),
  rejectHtml('newPassword'),
  [
    body('currentPassword')
      .isString()
      .withMessage('Current password must be a string')
      .bail()
      .notEmpty()
      .withMessage('Current password is required'),
    body('newPassword')
      .isString()
      .withMessage('New password must be a string')
      .bail()
      .notEmpty()
      .withMessage('New password is required')
      .bail()
      .isLength({ min: 8 })
      .withMessage('New password must be at least 8 characters long')
      .bail()
      .matches(/[A-Z]/)
      .withMessage('New password must contain at least one uppercase letter')
      .bail()
      .matches(/[a-z]/)
      .withMessage('New password must contain at least one lowercase letter')
      .bail()
      .matches(/[0-9]/)
      .withMessage('New password must contain at least one number')
      .bail()
      .matches(/[^a-zA-Z0-9]/)
      .withMessage('New password must contain at least one special character')
      .not()
      .equals(body('currentPassword'))
      .withMessage('New password must be different from current password'),
  ],
  authController.changePassword
);

router.patch(
  '/change-profile',
  isAuth,
  rejectHtml('email'),
  rejectHtml('name'),
  [
    body('email')
      .optional()
      .isString()
      .withMessage('Email must be a string')
      .bail()
      .trim()
      .escape()
      .notEmpty()
      .withMessage('Email cannot be empty')
      .isEmail()
      .withMessage('Please enter a valid email address')
      .normalizeEmail(),
    body('name')
      .optional()
      .isString()
      .withMessage('Name must be a string')
      .bail()
      .notEmpty()
      .withMessage('Name cannot be empty')
      .bail()
      .matches(/^[a-zA-Z0-9 \-'.,]+$/)
      .withMessage('Name contains invalid characters')
      .bail()
      .trim()
      .escape(),
  ],
  authController.updateProfile
);

router.delete(
  '/delete',
  isAuth,
  rejectHtml('confirmPassword'),
  [
    body('confirmPassword')
      .isString()
      .withMessage('Confirmation password must be a string')
      .bail()
      .notEmpty()
      .withMessage('Please enter your password to confirm account deletion'),
  ],
  authController.deleteAccount
);

router.get('/profile', isAuth, authController.getUserProfile);

module.exports = router;
