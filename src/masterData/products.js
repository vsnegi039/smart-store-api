const fs = require("fs");
const path = require("path");
const axios = require("axios");
const productSchema = require("../models/product");

// Function to download and save an image
const downloadImage = async (url, filepath) => {
	const response = await axios({ url, responseType: "stream" });
	return new Promise((resolve, reject) => {
		const writer = fs.createWriteStream(filepath);
		response.data.pipe(writer);
		writer.on("finish", resolve);
		writer.on("error", reject);
	});
};

// Function to save product images and thumbnails
const saveProductImages = async product => {
	const imagesDir = path.join(
		__dirname,
		"..",
		"..",
		"public",
		"images",
		"products",
		product.id.toString()
	);
	fs.mkdirSync(imagesDir, { recursive: true });

	const saveImage = async (imageUrl, filename) => {
		const filepath = path.join(imagesDir, filename);
		await downloadImage(imageUrl, filepath);
		return `${process.env.API_URL}/images/products/${
			product.id
		}/${filename}`;
	};

	// Download and save images
	product.images = await Promise.all(
		product.images.map((imageUrl, index) =>
			saveImage(imageUrl, `image_${index + 1}.png`)
		)
	);

	// Download and save thumbnail
	product.thumbnail = await saveImage(product.thumbnail, `thumbnail.png`);
};

// Main function to insert products if not already present
module.exports = async () => {
	const product = await productSchema.findOne({});
	// if (!product) {
		for (let i = 0; i < products.length; i++) {
			await saveProductImages(products[i]);
		}
		await productSchema.insertMany(products);
	// }
};

var products = [
	{
		id: 11,
		title: "300 Touring",
		description:
			"The 300 Touring is a stylish and comfortable sedan, known for its luxurious features and smooth performance.",
		category: "vehicle",
		price: 28999.99,
		discountPercentage: 7.15,
		rating: 4.56,
		stock: 53,
		tags: ["sedans", "vehicles"],
		brand: "Chrysler",
		sku: "SPG50KEL",
		weight: 5,
		dimensions: {
			width: 5.03,
			height: 6.98,
			depth: 8.65,
		},
		warrantyInformation: "3 year warranty",
		shippingInformation: "Ships overnight",
		availabilityStatus: "In Stock",
		reviews: [
			{
				rating: 2,
				comment: "Would not recommend!",
				date: "2024-05-23T08:56:21.626Z",
				reviewerName: "Miles Stevenson",
				reviewerEmail: "miles.stevenson@x.dummyjson.com",
			},
			{
				rating: 5,
				comment: "Very happy with my purchase!",
				date: "2024-05-23T08:56:21.626Z",
				reviewerName: "Hannah Robinson",
				reviewerEmail: "hannah.robinson@x.dummyjson.com",
			},
			{
				rating: 5,
				comment: "Great value for money!",
				date: "2024-05-23T08:56:21.626Z",
				reviewerName: "Harper Turner",
				reviewerEmail: "harper.turner@x.dummyjson.com",
			},
		],
		returnPolicy: "No return policy",
		minimumOrderQuantity: 1,
		meta: {
			createdAt: "2024-05-23T08:56:21.626Z",
			updatedAt: "2024-05-23T08:56:21.626Z",
			barcode: "4354670429851",
			qrCode: "https://dummyjson.com/public/qr-code.png",
		},
		images: [
			"https://cdn.dummyjson.com/products/images/vehicle/300%20Touring/1.png",
			"https://cdn.dummyjson.com/products/images/vehicle/300%20Touring/2.png",
			"https://cdn.dummyjson.com/products/images/vehicle/300%20Touring/3.png",
			"https://cdn.dummyjson.com/products/images/vehicle/300%20Touring/4.png",
			"https://cdn.dummyjson.com/products/images/vehicle/300%20Touring/5.png",
			"https://cdn.dummyjson.com/products/images/vehicle/300%20Touring/6.png",
		],
		thumbnail:
			"https://cdn.dummyjson.com/products/images/vehicle/300%20Touring/thumbnail.png",
	},
	{
		id: 12,
		title: "Charger SXT RWD",
		description:
			"The Charger SXT RWD is a powerful and sporty rear-wheel-drive sedan, offering a blend of performance and practicality.",
		category: "vehicle",
		price: 32999.99,
		discountPercentage: 2.27,
		rating: 2.92,
		stock: 85,
		tags: ["sedans", "sports cars", "vehicles"],
		brand: "Dodge",
		sku: "AWI8JXJ4",
		weight: 8,
		dimensions: {
			width: 27.01,
			height: 11.43,
			depth: 23.25,
		},
		warrantyInformation: "1 week warranty",
		shippingInformation: "Ships in 3-5 business days",
		availabilityStatus: "In Stock",
		reviews: [
			{
				rating: 2,
				comment: "Disappointing product!",
				date: "2024-05-23T08:56:21.626Z",
				reviewerName: "Clara Berry",
				reviewerEmail: "clara.berry@x.dummyjson.com",
			},
			{
				rating: 5,
				comment: "Highly impressed!",
				date: "2024-05-23T08:56:21.626Z",
				reviewerName: "Ella Adams",
				reviewerEmail: "ella.adams@x.dummyjson.com",
			},
			{
				rating: 4,
				comment: "Very happy with my purchase!",
				date: "2024-05-23T08:56:21.626Z",
				reviewerName: "Gabriel Hayes",
				reviewerEmail: "gabriel.hayes@x.dummyjson.com",
			},
		],
		returnPolicy: "30 days return policy",
		minimumOrderQuantity: 1,
		meta: {
			createdAt: "2024-05-23T08:56:21.626Z",
			updatedAt: "2024-05-23T08:56:21.626Z",
			barcode: "3076808951073",
			qrCode: "https://dummyjson.com/public/qr-code.png",
		},
		images: [
			"https://cdn.dummyjson.com/products/images/vehicle/Charger%20SXT%20RWD/1.png",
			"https://cdn.dummyjson.com/products/images/vehicle/Charger%20SXT%20RWD/2.png",
			"https://cdn.dummyjson.com/products/images/vehicle/Charger%20SXT%20RWD/3.png",
			"https://cdn.dummyjson.com/products/images/vehicle/Charger%20SXT%20RWD/4.png",
			"https://cdn.dummyjson.com/products/images/vehicle/Charger%20SXT%20RWD/5.png",
			"https://cdn.dummyjson.com/products/images/vehicle/Charger%20SXT%20RWD/6.png",
		],
		thumbnail:
			"https://cdn.dummyjson.com/products/images/vehicle/Charger%20SXT%20RWD/thumbnail.png",
	}
];
