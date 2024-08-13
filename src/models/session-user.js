const mongoose = require("mongoose");

const cart = new mongoose.Schema({
	productId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Product",
		require: true,
	},
	count: { type: Number, require: true },
});

const sessionUserSchema = new mongoose.Schema({
	sysId: { type: String, require: true },
	cart: { type: [cart], default: [] },
});

module.exports = mongoose.model("SessionUser", sessionUserSchema);
