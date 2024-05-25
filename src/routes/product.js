const express = require("express");
const router = express.Router();
const productController = require("../controllers/product");

router.get("/featuredProducts", productController.featuredProducts);
router.get("/:id", productController.product);

module.exports = router;