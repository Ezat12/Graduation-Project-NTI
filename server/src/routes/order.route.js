const express = require("express");
const router = express.Router();
const protectAuth = require("../middleware/protectAuth.middleware");
const { createOrder } = require("../controllers/order.controller");

router.post("/purchase/:courseId", protectAuth, createOrder);

module.exports = router;
