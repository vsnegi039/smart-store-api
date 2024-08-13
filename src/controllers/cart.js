const User = require("../models/user");
const SessionUser = require("../models/session-user");
const Product = require("../models/product");
const RESPONSES_MSGS = require("../response");

module.exports.addUserProduct = async (req, res) => {
	try {
		const { productId, productCount } = req.body;
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

module.exports.addSessionProduct = async (req, res) => {
	try {
		const { productId, productCount, sysId } = req.body;
		const product = await Product.findById(productId);
		if (!product) return RESPONSES_MSGS.invalid(res);
		const sessionUser = await SessionUser.findOne({ sysId });
		const index = findProductIndex(sessionUser.cart, productId);
		if (index === -1)
			sessionUser.cart.push({ productId: product._id, count: productCount });
		else {
			if (productCount == 0) sessionUser.cart.splice(index, 1);
			else
				sessionUser.cart[index] = {
					productId: product._id,
					count: productCount,
				};
		}
		await sessionUser.save();
		let responseObj = sessionUser.toObject();
		return RESPONSES_MSGS.success(res, responseObj);
	} catch (err) {
		console.log(err.message);
		RESPONSES_MSGS.error(res, err.message);
	}
};

module.exports.getCartProducts = async (req, res) => {
	try {
		const { userId, sysId } = req.query;
		let products = [];
		if (userId) {
			const cart = await User.findById(userId)
				.populate("cart.productId")
				.exec();
			if (cart) products = cart;
		} else if (sysId) {
			const user = await SessionUser.findOne({ sysId })
				.populate("cart.productId")
				.exec();
			if (user && user.cart) products = user.cart;
		}
		return RESPONSES_MSGS.success(res, products);
	} catch (err) {
		console.log(err.message);
		RESPONSES_MSGS.error(res, err.message);
	}
};

module.exports.removeProduct = async (req, res) => {
	try {
		const { userId, sysId, productId } = req.query;
		let user = null;
		if (userId) {
			user = await User.findById(userId);
		} else if (sysId) {
			user = await SessionUser.findOne({ sysId });
		}
		if (user && user.cart) {
			const index = findProductIndex(user.cart, productId);
			if (index !== -1) user.cart.splice(index, 1);
			else {
				return RESPONSES_MSGS.error(res, "Product not found!");
			}
		}
		const resp = await user.save();
		return RESPONSES_MSGS.success(res, resp);
	} catch (err) {
		console.log(err.message);
		RESPONSES_MSGS.error(res, err.message);
	}
};
