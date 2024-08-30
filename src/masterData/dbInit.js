const createProducts = require("./products");

module.exports = async () => {
	console.log("called");
	await createProducts();
};
