const { default: mongoose } = require("mongoose");

mongoose
	.connect("mongodb://127.0.0.1:27017/UniversitySystem", {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		serverSelectionTimeoutMS: 30000,
	})
	.then(() => console.log("Connected to MongoDB using Mongoose"))
	.catch((err) => console.error("Connection failed!", err));
