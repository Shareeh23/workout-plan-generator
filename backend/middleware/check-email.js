const User = require('../models/user');

module.exports = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      const error = new Error('Email already registered');
      error.statusCode = 409;
      error.data = { 
        code: 'EMAIL_EXISTS',
        email: req.body.email 
      };
      throw error;
    }
    next();
  } catch (err) {
    next(err);
  }
};