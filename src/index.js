const app = require("./app");
const mongoose = require("mongoose");
require("dotenv").config();
const port = process.env.PORT || 3000;
const mongoUrl = process.env.MONGO || "mongodb://127.0.0.1:27017/ecommerce";
const dbInit = require("./masterData/dbInit");

mongoose
	.connect(mongoUrl)
	.then(() => {
		console.log("Connected to MongoDB");
		app.listen(port, () => {
			console.log("Server is running at port: ", port);
			dbInit();
		});
	})
	.catch(err => {
		console.error("Error while running server:", err);
	});
