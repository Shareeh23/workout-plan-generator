module.exports = (req, res, next) => {
  if (!req.user?.isAdmin) {
    return res.status(403).json({
      status: 'error',
      code: 'ADMIN_ACCESS_REQUIRED',
      message: 'Administrator privileges required'
    });
  }
  next();
};