const mongoose = require("mongoose");
const staticData = require('../static-data/enums');

const ReviewSchema = new mongoose.Schema({
	rating: { type: Number, required: true },
	comment: { type: String, required: true },
	date: { type: Date },
	reviewverName: { type: String },
	reviewverEmail: { type: String },
});

const productSchema = new mongoose.Schema({
	title: { type: String, required: true },
	description: { type: String, required: true },
	category: {
		type: String,
		required: true,
		enum: staticData.category,
	},
	price: { type: Number, required: true },
	discountPercentage: { type: Number },
	rating: { type: Number },
	stock: { type: Number, required: true },
	tags: { type: [String] },
	brand: { type: String },
	weight: { type: Number },
	warrentyInfo: { type: String },
	shippingInfomation: { type: String },
	availabilityInfo: { type: String },
	reviews: { type: [ReviewSchema] },
	returnPolciy: { type: String },
	images: { type: [String] },
	thumbnail: { type: String },
});

module.exports = mongoose.model("Product", productSchema);
