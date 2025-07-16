const jwt = require('jsonwebtoken');

exports.generateAuthResponse = (user) => {
  const token = jwt.sign(
    {
      email: user.email,
      userId: user._id.toString(),
      isAdmin: user.isAdmin
    },
    process.env.JWT_SECRET_KEY,
    { expiresIn: '1h' }
  );

  return {
    token,
    userId: user._id.toString(),
    email: user.email,
    isAdmin: user.isAdmin
  };
};
