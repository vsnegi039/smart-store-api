const express = require("express");
const router = express.Router();
const productController = require("../controllers/product");

router.get("/featured", productController.featuredProducts);

router.get("/search", productController.getFilterProducts);

router.get("/page", productController.getProductByPage);

router.get("/top-rated", productController.getTopFiveProduct);

router.get("/related/:id", productController.getRelagtedProduct);

router.get("/:id", productController.getProductById);

router.post("/", productController.addProduct);

router.patch("/:id", productController.updateProduct);

router.delete("/:id", productController.deleteProduct);

module.exports = router;