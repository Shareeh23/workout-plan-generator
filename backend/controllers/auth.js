require('dotenv').config();

const path = require('path');
const fs = require('fs');
const crypto = require('crypto');

const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');

const User = require('../models/user');
const PasswordReset = require('../models/passwordResetSchema');

const { generateAuthResponse } = require('../utils/auth-util');
const sendPasswordResetEmail = require('../utils/emailService');

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
    const authData = generateAuthResponse(result);
    res.status(201).json({
      message: 'User registered successfully',
      ...authData,
    });
  } catch (err) {
    next(err);
  }
};

exports.oauthGoogle = async (req, res, next) => {
  const { name, email, googleId } = req.user;

  try {
    let user = await User.findOne({ email });
    const isNewUser = !user;

    if (!user) {
      user = new User({ name, email, googleId });
      await user.save();
    }

    const authData = generateAuthResponse(user);

    // Redirect with token and flags as query params
    const frontendUrl = new URL('http://localhost:5173/auth/callback');
    frontendUrl.searchParams.set('token', authData.token);
    frontendUrl.searchParams.set('isNewUser', isNewUser);
    frontendUrl.searchParams.set('hasWorkoutPlan', !!user.workoutPlan);
    frontendUrl.searchParams.set('isAdmin', user.isAdmin || 'false');

    return res.redirect(frontendUrl.toString());
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error('Validation failed.');
      error.statusCode = 422;
      error.data = errors.array();
      throw error;
    }

    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      const error = new Error('A user with this email could not be found');
      error.statusCode = 401;
      throw error;
    }

    if (user.googleId) {
      const error = new Error('Please sign in using Google');
      error.statusCode = 401;
      throw error;
    }

    const isEqual = await bcrypt.compare(password, user.password);
    if (!isEqual) {
      const error = new Error('Incorrect password!');
      error.statusCode = 401;
      throw error;
    }

    const authData = generateAuthResponse(user);
    res.status(200).json({
      message: 'Login successful',
      ...authData,
      hasWorkoutPlan: !!user.workoutPlan,
      isNewUser: user.workoutPlan === undefined || user.workoutPlan === null,
    });
  } catch (err) {
    if (!err.statusCode) err.statusCode = 401;
    next(err);
  }
};

exports.logout = (req, res) => {
  res.status(200).json({ 
    success: true,
    message: 'Successfully logged out' 
  });
};

exports.requestReset = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error('Validation failed.');
      error.statusCode = 422;
      error.data = errors.array();
      throw error;
    }

    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'No account found with this email address',
      });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    await PasswordReset.findOneAndUpdate(
      { email },
      {
        email,
        otp,
        otpExpires,
        isOtpVerified: false,
        otpVerifiedAt: null,
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    await sendPasswordResetEmail(email, otp);

    res.status(200).json({
      success: true,
      message: 'A reset OTP has been sent to your email',
    });
  } catch (error) {
    next(error);
  }
};

exports.verifyOtp = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error('Validation failed.');
      error.statusCode = 422;
      error.data = errors.array();
      throw error;
    }

    const { email, otp } = req.body;
    const now = new Date();

    const resetRecord = await PasswordReset.findOneAndUpdate(
      {
        email,
        otp,
        otpExpires: { $gt: now },
        isOtpVerified: false,
      },
      {
        $set: {
          isOtpVerified: true,
          otpVerifiedAt: new Date(),
        },
      },
      { new: true }
    );

    if (!resetRecord) {
      return res.status(400).json({
        success: false,
        message: 'Invalid OTP, or OTP has expired or already used',
      });
    }

    res.status(200).json({
      success: true,
      message: 'OTP verified successfully',
      otp: resetRecord.otp,
    });
  } catch (error) {
    next(error);
  }
};

exports.changePassword = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error('Validation failed.');
      error.statusCode = 422;
      error.data = errors.array();
      throw error;
    }

    const { newPassword, email } = req.body;

    const resetRecord = await PasswordReset.findOne({
      email,
      isOtpVerified: true,
      otpExpires: { $gt: new Date() },
    });

    if (!resetRecord) {
      return res.status(400).json({
        success: false,
        message:
          'No valid password reset request found. Please start the reset process again.',
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);
    user.password = hashedPassword;
    await user.save();

    await PasswordReset.deleteOne({ _id: resetRecord._id });
    res.clearCookie('resetToken');

    res.status(200).json({
      success: true,
      message: 'Password changed successfully',
    });
  } catch (error) {
    next(error);
  }
};

exports.updateProfile = async (req, res, next) => {
  try {
    const { email, name, currentPassword, newPassword } = req.body;
    const userId = req.user._id;

    const user = await User.findById(userId);
    if (!user) {
      const error = new Error('User not found');
      error.statusCode = 404;
      throw error;
    }

    // Check if email is being updated and is unique
    if (email && email !== user.email) {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        const error = new Error('Email already in use');
        error.statusCode = 409;
        throw error;
      }
      user.email = email;
    }

    // Verify current password (already validated as required in routes)
    const isPasswordValid = await bcrypt.compare(
      currentPassword,
      user.password
    );
    if (!isPasswordValid) {
      const error = new Error('Current password is incorrect');
      error.statusCode = 401;
      throw error;
    }

    user.name = name;
    user.password = await bcrypt.hash(newPassword, 12);

    await user.save();

    // Return updated user data (excluding password)
    const userData = user.toObject();
    delete userData.password;

    res.status(200).json({
      message: 'Profile updated successfully',
      user: {
        id: userData._id,
        name: userData.name,
        email: userData.email,
      },
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

exports.getUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id)
      .select('name email profilePicture')
      .lean();

    if (!user) {
      const error = new Error('User not found');
      error.statusCode = 404;
      throw error;
    }

    res.status(200).json({
      message: 'User profile retrieved successfully',
      user,
    });
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
};

exports.uploadProfilePicture = async (req, res, next) => {
  try {
    if (!req.file) {
      const error = new Error('No image file provided');
      error.statusCode = 422;
      throw error;
    }

    const user = await User.findById(req.user._id);
    if (user.profilePicture) {
      const oldImagePath = path.join(__dirname, '..', user.profilePicture);
      if (fs.existsSync(oldImagePath)) {
        fs.unlink(oldImagePath, (err) => {
          if (err) console.error('Error deleting old profile picture:', err);
        });
      }
    }

    const imagePath = '/uploads/' + req.file.filename;
    user.profilePicture = imagePath;
    const updatedUser = await user.save();

    const userData = {
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      profilePicture: imagePath,
    };

    res.status(200).json({
      message: 'Profile picture uploaded successfully',
      user: userData,
      imagePath: imagePath,
    });
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
};
