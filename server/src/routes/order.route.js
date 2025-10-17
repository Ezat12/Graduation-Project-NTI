const express = require("express");
const router = express.Router();
const protectAuth = require("../middleware/protectAuth.middleware");
const { getCheckoutSession } = require("../controllers/order.controller");

router.post("/checkout-session/:courseId", protectAuth, getCheckoutSession);

module.exports = router;
