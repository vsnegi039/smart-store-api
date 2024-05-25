const RESPONSES_MSGS = require("../response");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

module.exports.signup = async (req, res) => {
	try {
		const { firstName, lastName, email, password } = req.body;
		if (!(firstName || lastName || email || password)) {
			return RESPONSES_MSGS.invalid(res);
		}
		let isUserAlreadyExist = await User.findOne({ email });
		if (isUserAlreadyExist)
			return RESPONSES_MSGS.error(res, "User already exist");
		const user = new User({
			firstName,
			lastName,
			email,
		});
		const userId = user._id.toString();
		const token = createJWT(req.body, userId);
		const saltRounds = 10;
		const hashPassword = await bcrypt.hash(password, saltRounds);
		user.password = hashPassword;
		await user.save();
		const responseObj = {
			firstName,
			lastName,
			email,
			jwtToken: {
				token,
				expiresIn: "7 days",
			},
		};
		return RESPONSES_MSGS.success(res, responseObj);
	} catch (err) {
		RESPONSES_MSGS.error(res, err.message);
	}
};

module.exports.login = async (req, res) => {
	try {
		const { email, password } = req.body;
		if (!(email || password)) return RESPONSES_MSGS.invalid(res);
		const user = await User.findOne({ email });
		if (!user)
			return RESPONSES_MSGS.error(
				res,
				"User doesn't exist, Please sign up first."
			);
		const isPasswordMatched = bcrypt.compare(password, user.password);
		if (!isPasswordMatched)
			return RESPONSES_MSGS.error(res, "Incorrect password.");
		const userId = user._id.toString();
		const token = createJWT(user, userId);
		const responseObj = {
			firstName: user.firstName,
			lastName: user.lastName,
			email: user.email,
			jwtToken: {
				token,
				expiresIn: "7 days",
			},
		};
		return RESPONSES_MSGS.success(res, responseObj);
	} catch (err) {
		return RESPONSES_MSGS.error(res, err.message);
	}
};

function createJWT(data, userId) {
	const secretKey = process.env.SECRETKEY || "my_secret_key";
	const payload = {
		firstName: data.firstName,
		lastName: data.lastName,
		email: data.email,
		userId,
	};
	const token = jwt.sign(payload, secretKey, { expiresIn: "168h" });
	return token;
}
