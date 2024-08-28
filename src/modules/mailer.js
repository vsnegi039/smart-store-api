const nodemailer = require("nodemailer");

// var transporter = nodemailer.createTransport({
// 	host: "live.smtp.mailtrap.io",
// 	port: 587,
// 	auth: {
// 		user: "api",
// 		pass: "8d8e9e7a9804c44ae300a94927573c0e",
// 	},
// });

module.exports.sendSubscribeMail = async customerMail => {
	const mailOptions = {
		from: "ingo@demomailtrap.com",
		to: customerMail,
		subject: "Hello from Node.js",
		text: "This is a plain text message",
	};

	// Send mail with the transporter object
	transporter.sendMail(mailOptions, (error, info) => {
		if (error) {
			return console.log(error);
		}
		console.log("Message sent: %s", info.messageId);
	});
};
