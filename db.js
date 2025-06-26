const { default: mongoose } = require("mongoose");

mongoose
	.connect("mongodb://127.0.0.1:27017/UniversitySystem", {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		serverSelectionTimeoutMS: 30000,
	})
	.then(() => console.log("Connected to MongoDB using Mongoose"))
	.catch((err) => console.error("Connection failed!", err));


// User
// Specifying Schema -- not essential
const userSchema = new mongoose.Schema({
	username: String,
	email: String,
	password: String,
	balance: Number,
});
const User = mongoose.model("User", userSchema);


// Reserve
const reserveSchema = new mongoose.Schema({
	userId: String,
	reserveDate: Date,
	foodName: String,
	restaurantName: String,
	price: Number,
});
const Reserve = mongoose.model("Reserve", reserveSchema);
