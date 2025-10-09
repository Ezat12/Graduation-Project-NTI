const expressAsyncHandler = require("express-async-handler");
const ApiError = require("../utils/apiError");

const allowedTo = (...allowed) =>
  expressAsyncHandler(async (req, res, next) => {
    if (!allowed.includes(req.user.role)) {
      return next(
        new ApiError("You are not authorized to access this route", 403)
      );
    }
    next();
  });

module.exports = allowedTo;
