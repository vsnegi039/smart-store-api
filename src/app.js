const express = require("express");
const cors = require("cors");
const productRouter = require("./routes/product");
const authRouter = require("./routes/auth");
const cartRouter = require("./routes/cart");

const app = express();

app.use(cors());
app.use(express.json());
app.use("/auth", authRouter);
app.use("/product", productRouter);
app.use("/cart", cartRouter);

module.exports = app;
