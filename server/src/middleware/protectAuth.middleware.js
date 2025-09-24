const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const ApiError = require("../utils/apiError");
const expressAsyncHandler = require("express-async-handler");

const protectAuth = expressAsyncHandler(async (req, res, next) => {
  let token;

  if (req.headers.authorization?.startsWith("Bearer ")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(new ApiError("you are not login ,please login ....", 401));
  }

  const decoded = jwt.verify(token, process.env.SECRET_TOKEN);

  const currentUser = await User.findById(decoded.userId);

  if (!currentUser) {
    return next(new ApiError("User not found", 404));
  }

  if (!currentUser?.active) {
    return next(new ApiError("User account is inactive", 403));
  }
  req.user = currentUser;
  next();
});

module.exports = protectAuth;
