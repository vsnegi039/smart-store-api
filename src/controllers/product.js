const productSchema = require("../models/product");

exports.featuredProducts = async (req, res) => {
	try {
		res.status(200).json({ status: true, msg: "Data Found" });
	} catch (err) {
		res.status(500).json({ status: false, msg: err.message });
	}
};
