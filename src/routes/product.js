const express = require("express");
const router = express.Router();
const productController = require("../controllers/product");

router.get("featuredProducts", productController.featuredProducts);

module.exports = router;