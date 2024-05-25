const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cart");
const is_auth = require("../middleware/is_auth");

router.get("/edit/:id/:count", is_auth, cartController.addToCart);

module.exports = router;
