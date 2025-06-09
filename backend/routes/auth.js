const express = require('express');
const { body } = require('express-validator');

const User = require('../models/user')
const authController = require('../controllers/auth');
const passport = require('passport')

const router = express.Router();

router.get('/signup/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get(
  '/signup/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: '/' }),
  authController.oauthGoogle
);

router.put('/signup/local', [
  body('email')
    .isEmail().withMessage('Please enter a valid email.')
    .custom((value, { req }) => {
      return User.findOne({ email: value }).then((userDoc) => {
        if (userDoc) {
          return Promise.reject('E-mail address already exists!');
        }
      });
    })
    .normalizeEmail(),
  body('password').trim().isLength({ min: 5 }),
  body('name').trim().not().isEmpty(),
], authController.signup);

router.post('/login', [
  body('email').isEmail().withMessage('Invalid email.').normalizeEmail(),
  body('password').trim().notEmpty().withMessage('Password is required.'),
], authController.login);

module.exports = router;
