const express = require("express");
const router = express.Router();

const allowedTo = require("../middleware/allowedTo.middleware");
const protectAuth = require("../middleware/protectAuth.middleware");
const {
  login,
  signUp,
  changePassword,
  changeDataUser,
  getProfile,
} = require("../controllers/auth.controller");
const {
  validateCreatedUser,
  validateLogin,
  validateChangeMe,
  validateChangePassword
} = require("../validations/user.validation");

router.post("/login", validateLogin, login);
router.post("/signup", validateCreatedUser, signUp);
router.get("/me", protectAuth ,getProfile);
router.put("/update-me" , protectAuth , validateChangeMe , changeDataUser )
router.patch("/change-password", protectAuth, validateChangePassword ,  changePassword);

module.exports = router;
