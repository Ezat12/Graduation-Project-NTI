const express = require("express");
const router = express.Router();

const allowedTo = require("../middleware/allowedTo.middleware");
const protectAuth = require("../middleware/protectAuth.middleware");
const {
  login,
  signUp,
  changePassword,
} = require("../controllers/auth.controller");
const {
  validateCreatedUser,
  validateLogin,
} = require("../validations/user.validation");

router.post("/login", validateLogin, login);
router.post("/signup", validateCreatedUser, signUp);
router.patch("/change-password", protectAuth, changePassword);

module.exports = router;
