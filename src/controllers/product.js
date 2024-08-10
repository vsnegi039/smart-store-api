const Product = require("../models/product");
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
		const filteredCategories = category.filter(
			category => !unwantedCategories.includes(category)
		);
		const shuffledCategories = filteredCategories.sort(
			() => 0.5 - Math.random()
		);
		const selectedCategories = shuffledCategories.slice(0, 10);
		const productPromises = selectedCategories.map(category => {
			return Product.findOne({ category });
		});
		const products = await Promise.all(productPromises);
		const validProducts = products.filter(product => product !== null);
		return RESPONSES_MSGS.success(res, validProducts);
	} catch (err) {
		return RESPONSES_MSGS.error(res, err.message);
	}
};

exports.getProductById = async (req, res) => {
	try {
		const id = req.params.id;
		const product = await Product.findOne({ _id: id });
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

const validateProductData = (data, staticData) => {
	const { title, description, category, price, stock, reviews } = data;
	const missingFields = [];

	if (!title) missingFields.push("title");
	if (!description) missingFields.push("description");
	if (!price) missingFields.push("price");
	if (!stock) missingFields.push("stock");
	if (!category) missingFields.push("category");

	if (missingFields.length > 0) {
		return `The following fields are required: ${missingFields.join(", ")}`;
	}

	if (!staticData.category.includes(category)) {
		return "Invalid category";
	}

	if (reviews) {
		const error = validateReviews(reviews);
		if (error) return error;
	}

	return null;
};

const validateReviews = reviews => {
	if (!Array.isArray(reviews)) {
		return "Reviews must be an array.";
	}
	for (let review of reviews) {
		if (!(review.rating && review.comment)) {
			return "Each review must contain a rating and a comment.";
		}
	}
	return null;
};

exports.addProduct = async (req, res) => {
	try {
		const error = validateProductData(req.body, staticData);
		if (error) {
			return RESPONSES_MSGS.error(res, error);
		}

		const { title, category } = req.body;
		const existingProduct = await Product.findOne({ title, category });

		if (existingProduct) {
			return RESPONSES_MSGS.error(res, "Product already exists!");
		}

		const newProduct = new Product(req.body);
		const savedProduct = await newProduct.save();

		return RESPONSES_MSGS.success(res, savedProduct);
	} catch (err) {
		return RESPONSES_MSGS.error(res, err.message);
	}
};

exports.updateProduct = async (req, res) => {
	try {
		const id = req.params.id;
		const { reviews, ...updateFields } = req.body;

		if (!id) return RESPONSES_MSGS.invalid(res, "Id is required!");
		let product = await Product.findById(id);
		if (!product) return RESPONSES_MSGS.invalid(res, "Product not found!");

		if (reviews) {
			const error = validateReviews(reviews);
			if (error) return RESPONSES_MSGS.error(res, error);
			updateFields.reviews = reviews;
		}

		product = await Product.findByIdAndUpdate(id, updateFields, { new: true });

		return RESPONSES_MSGS.success(res, product);
	} catch (err) {
		return RESPONSES_MSGS.error(res, err.message);
	}
};

exports.deleteProduct = async (req, res) => {
	try {
		const id = req.params.id;
		if (!id) return RESPONSES_MSGS.error(res, "Id is required!");
		let product = await Product.findByIdAndDelete(id);
		if (!product) return RESPONSES_MSGS.error(res, "Product not found!");
		return RESPONSES_MSGS.success(res, product);
	} catch (err) {
		return RESPONSES_MSGS.error(res, err.message);
	}
};

exports.getProductByPage = async (req, res) => {
	try {
		const { page = 1 } = req.query;
		const pageSize = 30;
		const skip = (page - 1) * pageSize;
		const products = await Product.find().skip(skip).limit(pageSize);
		const totalProducts = await Product.countDocuments();
		return RESPONSES_MSGS.success(res, { products, totalProducts });
	} catch (err) {
		return RESPONSES_MSGS.error(res, err.message);
	}
};

exports.getRelagtedProduct = async (req, res) => {
	try {
		const id = req.params.id;
		if (!id) return RESPONSES_MSGS.error(res, "Id is required");
		const product = await Product.findById(id);
		if (!product) return RESPONSES_MSGS.error(res, "Product not found");
		const relatedProducts = await Product.find({
			category: product.category,
		}).limit(10);
		return RESPONSES_MSGS.success(res, relatedProducts);
	} catch (err) {
		return RESPONSES_MSGS.error(res, err.message);
	}
};

exports.getTopFiveProduct = async (req, res) => {
	try {
		const topProducts = await Product.aggregate([
			{
				$sort: { rating: -1 },
			},
			{
				$limit: 5,
			},
		]);
		if (!topProducts.length) {
			return RESPONSES_MSGS.error(res, "No products found!");
		}
		return RESPONSES_MSGS.success(res, topProducts);
	} catch (err) {
		return RESPONSES_MSGS.error(res, err.message);
	}
};

module.exports.getFilterProducts = async (req, res) => {
	try {
		const { searchString, category } = req.query;
		const pageNumber = req.query.page || 0;
		const pageSize = 12;
		const skip = pageNumber * pageSize;

		const query = {};

		if (searchString) {
			query.title = { $regex: searchString, $options: "i" };
		}

		if (category) {
			query.category = category;
		}

		const products = await Product.find(query).skip(skip).limit(pageSize);
		const totalProducts = await Product.countDocuments(query);

		const categoryCounts = await Product.aggregate([
			{ $match: query },
			{ $group: { _id: "$category", count: { $sum: 1 } } },
		]);

		return RESPONSES_MSGS.success(res, {
			products,
			totalProducts,
			categoryCounts,
		});
	} catch (err) {
		return RESPONSES_MSGS.error(res, err.message);
	}
};
