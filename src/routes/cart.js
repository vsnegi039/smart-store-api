const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cart");
const is_auth = require("../middleware/is_auth");

router.post("/auth/add", is_auth, cartController.addUserProduct);

router.post("/session/add", cartController.addSessionProduct);

router.get("/", cartController.getCartProducts);

router.delete("/", cartController.removeProduct);

module.exports = router;
