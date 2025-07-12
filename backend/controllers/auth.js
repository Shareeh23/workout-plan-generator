require('dotenv').config();

const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

exports.signup = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error('Validation failed.');
      error.statusCode = 422;
      error.data = errors.array();
      throw error;
    }

    const { name, email, password } = req.body;
    const hashedPw = await bcrypt.hash(password, 12);

    const user = new User({ email, password: hashedPw, name });
    const result = await user.save();

    res.status(201).json({ message: 'User created!', userId: result._id });
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
};

exports.oauthGoogle = async (req, res, next) => {
  const { name, email, googleId } = req.user;

  try {
    let user = await User.findOne({ email });

    if (!user) {
      user = new User({ name, email, googleId });
      await user.save();
    }

    const token = jwt.sign(
      { 
        email: user.email, 
        userId: user._id.toString(),
        isAdmin: user.isAdmin 
      },
      process.env.JWT_SECRET_KEY,
      { expiresIn: '1h' }
    );

    res.status(200).json({ token, userId: user._id.toString(), isAdmin: user.isAdmin });
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      const error = new Error('A user with this email could not be found');
      error.statusCode = 401;
      throw error;
    }

    // Check if user signed up via Google
    if (user.googleId) {
      const error = new Error('Please sign in using Google');
      error.statusCode = 401;
      throw error;
    }

    const isEqual = await bcrypt.compare(password, user.password);
    if (!isEqual) {
      const error = new Error('Wrong password!');
      error.statusCode = 401;
      throw error;
    }

    const token = jwt.sign(
      { 
        email: user.email, 
        userId: user._id.toString(),
        isAdmin: user.isAdmin 
      },
      process.env.JWT_SECRET_KEY,
      { expiresIn: '1h' }
    );

    res.status(200).json({ token, userId: user._id.toString(), isAdmin: user.isAdmin });
  } catch (err) {
    if (!err.statusCode) err.statusCode = 401;
    next(err);
  }
};

exports.changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user._id;

    const user = await User.findById(userId);
    if (!user) {
      const error = new Error('User not found');
      error.statusCode = 404;
      throw error;
    }

    // Prevent Google users from changing password
    if (user.googleId) {
      const error = new Error('Google-authenticated users cannot change password');
      error.statusCode = 403;
      throw error;
    }

    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      const error = new Error('Current password is incorrect');
      error.statusCode = 401;
      throw error;
    }

    // Hash and save new password
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: 'Password updated successfully' });
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
};

exports.updateProfile = async (req, res, next) => {
  try {
    const { email, name } = req.body;
    
    // Check if email is being updated and is unique
    if (email) {
      const existingUser = await User.findOne({ email });
      if (existingUser && existingUser._id.toString() !== req.user._id.toString()) {
        const error = new Error('Email already in use');
        error.statusCode = 409;
        throw error;
      }
    }

    const user = await User.findById(req.user._id);
    if (name) user.name = name;
    if (email) user.email = email;
    await user.save();

    res.status(200).json({ 
      message: 'Profile updated',
      user: { name: user.name, email: user.email }
    });
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
};

exports.deleteAccount = async (req, res, next) => {
  try {
    await User.findByIdAndDelete(req.user._id);
    res.status(200).json({ message: 'Account deleted successfully' });
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
};