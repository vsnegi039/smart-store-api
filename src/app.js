const express = require("express");
const cors = require("cors");
const path = require("path");
const productRouter = require("../src/routes/product");
const authRouter = require("../src/routes/auth");
const cartRouter = require("../src/routes/cart");

const app = express();

app.use(cors());
app.use(express.json());
app.use("/images", express.static(path.join(__dirname, "public/images")));

app.use("/auth", authRouter);
app.use("/product", productRouter);
app.use("/cart", cartRouter);

module.exports = app;
