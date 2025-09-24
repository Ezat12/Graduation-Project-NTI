const { ValidationError } = require("express-validation");

const errorHandler = (err, req, res, next) => {
  if (err instanceof ValidationError) {
    return res.status(err.statusCode).json({
      message: err.message,
      statusCode: err.statusCode,
      details: err.details,
    });
  }

  res.status(err.statusCode || 500).json({
    message: err.message || "Something went wrong",
    statusCode: err.statusCode || 500,
  });
};

module.exports = errorHandler;
