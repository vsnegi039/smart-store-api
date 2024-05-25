const productSchema = require("../models/product");
const staticData = require("../static-data/enums");
const RESPONSES_MSGS = require("../response");

exports.featuredProducts = async (req, res) => {
	try {
		const category = staticData.category;
		const unwantedCategories = [
			"furniture",
			"groceries",
			"home-decoration",
			"kitchen-accessories",
			"motorcycle",
			"vehicle",
		];
		const filteredCategories = categories.filter(
			category => !unwantedCategories.includes(category)
		);
		const shuffledCategories = filteredCategories.sort(
			() => 0.5 - Math.random()
		);
		const selectedCategories = shuffledCategories.slice(0, 10);
		const productPromises = selectedCategories.map(category => {
			return productSchema.findOne({ category });
		});
		const products = await Promise.all(productPromises);
		const validProducts = products.filter(product => product !== null);
		return RESPONSES_MSGS.success(res, validProducts);
	} catch (err) {
		return RESPONSES_MSGS.error(res, err.message);
	}
};

exports.product = async (req, res) => {
	try {
		const id = req.params.id;
		const product = await productSchema.findOne({ _id: id });
		if (product) return RESPONSES_MSGS.success(res, product);
		else
			return RESPONSES_MSGS.error(
				res,
				"This product didn't exist in our database"
			);
	} catch (err) {
		return RESPONSES_MSGS.error(res, err.message);
	}
};
