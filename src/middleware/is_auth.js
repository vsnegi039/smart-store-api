const jwt = require("jsonwebtoken");
const User = require("../models/user");
const RESPONSES_MSGS = require("../response");

module.exports = async (req, res, next) => {
	const authHeader = req.get("Authorization");
	if (!authHeader) {
		return RESPONSES_MSGS.invalid(res);
	}
	const token = authHeader.split(" ")[1];
	let decodedToken;
	try {
		const secretKey = process.env.SECRETKEY;
		decodedToken = jwt.verify(token, secretKey);
		const user = await User.findOne({
			_id: decodedToken.userId,
		});
		req.user = user;
		if (user) next();
		else
			return RESPONSES_MSGS.error(
				res,
				"User session expired, please log out and log back in"
			);
	} catch (err) {
		return RESPONSES_MSGS.error(res, err.message);
	}
};
