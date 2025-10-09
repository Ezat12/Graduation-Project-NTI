const express = require("express");

const router = express.Router();
const {
  createUser,
  getAllUser,
  getUser,
  updateUser,
  deleteUser,
} = require("../controllers/user.controller");
const allowedTo = require("../middleware/allowedTo.middleware");
const protectAuth = require("../middleware/protectAuth.middleware");
const {
  validateCreatedUser,
  validateUpdatedUser,
} = require("../validations/user.validation");

router.route("/").post(validateCreatedUser, createUser).get(getAllUser);
router
  .route("/:id")
  .get(getUser)
  .put(validateUpdatedUser, updateUser)
  .delete(deleteUser);

module.exports = router;
