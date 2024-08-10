const RESPONSES_MSGS = {
	success: (res, data) => {
		return res
			.status(200)
			.json({ status: true, message: "Success", data: data });
	},
	error: (res, error = "Oops! Something went wrong") => {
		return res.status(400).json({
			status: false,
			message: error,
			data: null,
		});
	},
	invalid: res => {
		return res.status(500).json({
			status: false,
			message: "Invalid params",
			data: null,
		});
	},
};

module.exports = RESPONSES_MSGS;
