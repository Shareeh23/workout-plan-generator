const rejectHtml = (fieldName) => {
  return (req, res, next) => {
    const value = req.body[fieldName];
    if (value && /<[^>]*>/g.test(value)) {
      const error = new Error(`${fieldName} cannot contain HTML tags`);
      error.statusCode = 400;
      error.data = [{ 
        msg: error.message,
        param: fieldName,
        location: 'body'
      }];
      return next(error);
    }
    next();
  };
};

module.exports = rejectHtml;