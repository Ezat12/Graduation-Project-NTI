const express = require("express");
const upload = require("../middleware/upload.middleware");
const {
  cloudinaryUpload,
  cloudinaryBulkUpload,
} = require("../controllers/upload.controller");

const router = express.Router();

router.route("/single").post(upload, cloudinaryUpload);
router.route("/bulk").post(upload, cloudinaryBulkUpload);

module.exports = router;
