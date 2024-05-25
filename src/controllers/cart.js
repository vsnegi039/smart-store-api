const User = require("../models/user");
const Product = require("../models/product");
const RESPONSES_MSGS = require("../response");

module.exports.addToCart = async (req, res) => {
	try {
		const productId = req.params.id;
		const productCount = req.params.count;
		const product = await Product.findOne({ _id: productId });
		if (!product) return RESPONSES_MSGS.invalid(res);
		const index = findProductIndex(req.user.cart, productId);
		if (index === -1)
			req.user.cart.push({ productId: product._id, count: productCount });
		else {
			if (productCount == 0) req.user.cart.splice(index, 1);
			else
				req.user.cart[index] = { productId: product._id, count: productCount };
		}
		await req.user.save();
		let responseObj = req.user.toObject();
		delete responseObj.password;
		return RESPONSES_MSGS.success(res, responseObj);
	} catch (err) {
		RESPONSES_MSGS.error(res, err.message);
	}
};

function findProductIndex(products, productId) {
	for (let i = 0; i < products.length; i++) {
		if (products[i].productId.toString() === productId) {
			return i;
		}
	}
	return -1;
}
