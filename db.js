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


// Food
const foodSchema = new mongoose.Schema({
  name: String,
  image: String,  // اینجا فقط URL تصویر رو ذخیره می‌کنیم
  price: Number,
});

const Food = mongoose.model("Food", foodSchema);
const courseSchema = new mongoose.Schema({
    semester: String,
    code: String,
    name: String,
    group: String,
    professor: String,
    units: Number,
});
const Course = mongoose.model("Course", courseSchema);


// Request model
const requestSchema = new mongoose.Schema({
  title: String,
  from: String,
  body: String,
  status: { type: String, default: "submitted" },
  createdAt: { type: Date, default: Date.now }
});
const Request = mongoose.model("Request", requestSchema);


// News model
const newsSchema = new mongoose.Schema({
  title: String,
  body: String,
  image: String
}, { timestamps: true });

const News = mongoose.model("News", newsSchema);


// Finance model
const financeSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  transactions: [{
    date: { type: Date, default: Date.now },
    desc: String,
    amount: Number,
    type: { type: String, enum: ["credit", "debit"] }
  }]
});

const Finance = mongoose.model("Finance", financeSchema);


module.exports.User = User;
module.exports.Reserve = Reserve;
module.exports.Food = Food;
module.exports.Course = Course;
module.exports.Request = Request;
module.exports.News = News;
module.exports.Finance = Finance;
