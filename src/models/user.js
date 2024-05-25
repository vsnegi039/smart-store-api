const mongoose = require("mongoose");

const cart = new mongoose.Schema({
	productId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Product",
		require: true,
	},
	count: { type: Number, require: true },
});

const userSchema = new mongoose.Schema({
	firstName: { type: String, require: true },
	lastName: { type: String, require: true },
	email: { type: String, require: true, unique: true },
	password: { type: String, require: true },
	cart: [cart],
});

module.exports = mongoose.model("User", userSchema);
