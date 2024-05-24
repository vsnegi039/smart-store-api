const RESPONSES_MSGS = {
	success: () => {
		return { status: "OK", message: "Success", data: null };
	},
	error: () => {
		return {
			status: "ERROR",
			message: "Oops! Something went wrong ",
			data: null,
		};
	},
	invalid: () => {
		return {
			status: "ERROR",
			message: "Invalid params",
			data: null,
		};
	},
};

module.exports = RESPONSES_MSGS;
