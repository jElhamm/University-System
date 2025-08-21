const mongoose = require("mongoose");
const http = require("http");
const fs = require("fs");
const path = require("path");
const querystring = require("querystring");
const bcrypt = require("bcrypt");
const { Food, User, Reserve, Course, Request, News, Finance } = require("./db");

// To read html and css files
function serveFile(filePath, contentType, res) {
	fs.readFile(filePath, (err, data) => {
		if (err) {
			res.writeHead(500, { "Content-Type": "text/plain" });
			res.end("Internal Server Error");
		} else {
			res.writeHead(200, { "Content-Type": contentType });
			res.end(data);
		}
	});
}

const server = http.createServer(async (req, res) => {
	if (req.url === "/" && req.method === "GET") {
		serveFile(
			path.join(__dirname, "public", "index.html"),
			"text/html",
			res
		);
	}

	else if (req.url === "/signup" && req.method === "GET") {
		serveFile(
			path.join(__dirname, "public", "signup.html"),
			"text/html",
			res
		);
	}
	
	else if (req.url === "/login" && req.method === "GET") {
		serveFile(
			path.join(__dirname, "public", "login.html"),
			"text/html",
			res
		);
	}

	else if (req.url === "/Dashboard" && req.method === "GET") {
		serveFile(
			path.join(__dirname, "public", "dashboard.html"),
			"text/html",
			res
		);
	}

	else if (req.url === "/Food" && req.method === "GET") {
		serveFile(
			path.join(__dirname, "public", "food.html"),
			"text/html",
			res
		);
	}

	else if (req.url === "/courses" && req.method === "GET") {
		serveFile(path.join(__dirname, "public", "courses.html"), "text/html", res);
	}

	else if (req.url === "/requests" && req.method === "GET") {
		serveFile(path.join(__dirname, "public", "requests.html"), "text/html", res);
	}

	else if (req.url === "/news" && req.method === "GET") {
		serveFile(path.join(__dirname, "public", "news.html"), "text/html", res);
	}

	else if (req.url === "/finance" && req.method === "GET") {
		serveFile(path.join(__dirname, "public", "finance.html"), "text/html", res);
	}
	
	else if (req.url === "/api/foods" && req.method === "GET") {
		Food.find()
			.then((foods) => {
			const foodsWithImages = foods.map((food) => ({
				name: food.name,
				price: food.price,
				image: food.image,  // مستقیم URL را ارسال می‌کنیم
			}));
			res.writeHead(200, { "Content-Type": "application/json" });
			res.end(JSON.stringify(foodsWithImages));
			})
			.catch((err) => {
			console.error("Error fetching foods:", err);
			res.writeHead(500, { "Content-Type": "application/json" });
			res.end(
				JSON.stringify({ message: "خطا در دریافت لیست غذاها" })
			);
			});
		}

	else if (req.url.startsWith("/api/user/") && req.method === "GET") {
		const userId = req.url.split("/")[3];

		if (!userId) {
			res.writeHead(400, { "Content-Type": "application/json" });
			res.end(JSON.stringify({ message: "User ID is required" }));
			return;
		}

		User.findById(userId)
			.select("-password")
			.then((user) => {
				if (!user) {
					res.writeHead(404, { "Content-Type": "application/json" });
					res.end(JSON.stringify({ message: "User not found" }));
					return;
				}
				res.writeHead(200, { "Content-Type": "application/json" });
				res.end(JSON.stringify(user));
			})
			.catch((err) => {
				console.error("Error fetching user by ID:", err);
				res.writeHead(500, { "Content-Type": "application/json" });
				res.end(JSON.stringify({ message: "خطا در دریافت کاربر" }));
			});
	}

	else if (req.url.startsWith("/api/user/") && req.method === "PUT") {
		const userId = req.url.split("/")[3];

		let body = "";
		req.on("data", (chunk) => {
			body += chunk.toString();
		});

		req.on("end", async () => {
			try {
				const data = JSON.parse(body);

				// Validate input
				if (!data.username || typeof data.username !== "string") {
					res.writeHead(400, { "Content-Type": "application/json" });
					return res.end(
						JSON.stringify({ message: "نام کاربری معتبر نیست" })
					);
				}

				let updateFields;

				if (data.username) {
					updateFields = { username: data.username };
				}

				if (data.password) {
					const saltRounds = 10;
					const hashedPassword = await bcrypt.hash(
						data.password,
						saltRounds
					);
					updateFields.password = hashedPassword;
				}

				const updatedUser = await User.findByIdAndUpdate(
					userId,
					updateFields,
					{ new: true, runValidators: true }
				);

				if (!updatedUser) {
					res.writeHead(404, { "Content-Type": "application/json" });
					return res.end(
						JSON.stringify({ message: "کاربر یافت نشد" })
					);
				}

				res.writeHead(200, { "Content-Type": "application/json" });
				res.end(
					JSON.stringify({
						message: "اطلاعات با موفقیت بروزرسانی شد",
					})
				);
			} catch (err) {
				console.error("Error updating user:", err);
				res.writeHead(500, { "Content-Type": "application/json" });
				res.end(
					JSON.stringify({ message: "خطا در بروزرسانی اطلاعات" })
				);
			}
		});
	}

	else if (req.url.startsWith("/api/reserves") && req.method === "GET") {
		const urlParts = new URL(req.url, `http://${req.headers.host}`);
		const userId = urlParts.searchParams.get("userId");
		const dateParam = urlParts.searchParams.get("date");

		const date = new Date(dateParam);

		Reserve.find({
			userId,
			reserveDate: date,
		})
			.then((reserves) => {
				res.writeHead(200, { "Content-Type": "application/json" });
				res.end(JSON.stringify(reserves));
			})
			.catch((err) => {
				console.error("Error fetching reserves:", err);
				res.writeHead(500, { "Content-Type": "application/json" });
				res.end(
					JSON.stringify({
						message: "خطا در دریافت رزروها",
						error: err.message,
					})
				);
			});
	}

	else if (req.url.startsWith("/api/reserves/") && req.method === "DELETE") {
		const id = req.url.split("/").pop();

		Reserve.findByIdAndDelete(id)
			.then(() => {
				res.writeHead(200, { "Content-Type": "application/json" });
				res.end(JSON.stringify({ message: "رزرو حذف شد" }));
			})
			.catch((err) => {
				console.error("Error deleting reserve:", err);
				res.writeHead(500, { "Content-Type": "application/json" });
				res.end(
					JSON.stringify({
						message: "حذف رزرو با خطا مواجه شد",
						error: err.message,
					})
				);
			});
	}

	else if (req.url === "/signup" && req.method === "POST") {
		// To gather user info and put them together
		let body = "";
		req.on("data", (chunk) => {
			body += chunk.toString();
		});

		// Listening for end of req
		req.on("end", async () => {
			try {
				const data = querystring.parse(body);
				const { username, email, password } = data;

				// Checking user Existence
				const userExitence = await User.findOne({ username });

				if (userExitence) {
					res.writeHead(400, { "Content-Type": "application/json" });
					res.end(JSON.stringify({ message: "User Exists!" }));
					return;
				}

				// Hashing password
				const hashedPassword = await bcrypt.hash(password, 10);
				const newUser = new User({
					username,
					email,
					password: hashedPassword,
				});

				// Saving data in db
				await newUser.save();

				// Sending result to front
				res.writeHead(200, { "Content-Type": "application/json" });
				res.end(JSON.stringify({ message: "Signup Successful!" }));
			} catch (err) {
				// Sending error to front
				console.error("Signup Error:", err);
				res.writeHead(500, { "Content-Type": "application/json" });
				res.end(
					JSON.stringify({
						message: "Signup failed!",
						error: err.message,
					})
				);
			}
		});
	}

	else if (req.url === "/login" && req.method === "POST") {
		let body = "";
		req.on("data", (chunk) => {
			body += chunk.toString();
		});

		req.on("end", async () => {
			try {
				const data = querystring.parse(body);
				const { username, password } = data;

				// Checking db for user
				const user = await User.findOne({ username });

				// Returning not found error if there is no user with given username
				if (!user) {
					res.writeHead(400, { "Content-Type": "application/json" });
					res.end(JSON.stringify({ message: "User Not Found!" }));
					return;
				}

				// Returning error if password is wrong
				const isMatch = await bcrypt.compare(password, user.password);
				if (!isMatch) {
					res.writeHead(400, { "Content-Type": "application/json" });
					res.end(JSON.stringify({ message: "Wrong Password!" }));
					return;
				}

				res.writeHead(200, { "Content-Type": "application/json" });
				res.end(
					JSON.stringify({
						message: "Login Successful!",
						id: user.id,
					})
				);
			} catch (err) {
				console.error("Login Error:", err);
				res.writeHead(500, { "Content-Type": "application/json" });
				res.end(JSON.stringify({ message: "Login Failed!" }));
			}
		});
	}

	else if (req.url === "/api/Reserve" && req.method === "POST") {
		let body = "";
		req.on("data", (chunk) => {
			body += chunk.toString();
		});

		req.on("end", async () => {
			try {
				const data = querystring.parse(body);
				const { userId, date, food, restaurant } = data;

				const foodDoc = await Food.findOne({ name: food });
				const price = foodDoc?.price;

				if (!foodDoc) {
					res.writeHead(404, { "Content-Type": "application/json" });
					return res.end(
						JSON.stringify({ message: "Food not found" })
					);
				}

				const newReserve = new Reserve({
					userId,
					reserveDate: new Date(date),
					foodName: food,
					restaurantName: restaurant,
					price,
				});

				await newReserve.save();

				res.writeHead(200, { "Content-Type": "application/json" });
				res.end(JSON.stringify({ message: "Reserve Successful!" }));
			} catch (err) {
				console.error("Reserve Error:", err);
				res.writeHead(500, { "Content-Type": "application/json" });
				res.end(
					JSON.stringify({
						message: "Reserve failed!",
						error: err.message,
					})
				);
			}
		});
	}

	else if (req.url.endsWith(".css")) {
		serveFile(path.join(__dirname, "public", req.url), "text/css", res);
	}

	else if (req.url.match(/\.(jpg|jpeg|png|gif|svg)$/)) {
		const ext = path.extname(req.url).toLowerCase();
		const types = {
			".jpg": "image/jpeg",
			".jpeg": "image/jpeg",
			".png": "image/png",
			".gif": "image/gif",
			".svg": "image/svg+xml",
		};

		const filePath = path.join(__dirname, "public", req.url);
		const contentType = types[ext] || "application/octet-stream";
		serveFile(filePath, contentType, res);
	}

	else if (req.url.endsWith(".js")) {
		serveFile(
			path.join(__dirname, "public", req.url),
			"application/javascript",
			res
		);
	}

	else if (req.url.endsWith(".js")) {
		serveFile(
			path.join(__dirname, "", req.url),
			"application/javascript",
			res
		);
	}

	else if (req.url === "/update-profile" && req.method === "POST") {
		let body = "";
		req.on("data", (chunk) => {
			body += chunk.toString();
		});

		req.on("end", async () => {
			try {
				const data = JSON.parse(body);
				const { username, newPassword } = data;

				// This username is the new username user wants to set
				const existingUser = await User.findOne({ username });

				// Prevent duplication if user is trying to change their username
				if (existingUser && existingUser.username !== username) {
					res.writeHead(400, { "Content-Type": "application/json" });
					res.end(
						JSON.stringify({
							message: "این نام کاربری قبلاً ثبت شده است.",
						})
					);
					return;
				}

				// Get the current username from localStorage (sent manually in body or cookie in real apps)
				const currentUsername = req.headers["x-current-username"];
				const user = await User.findOne({ username: currentUsername });

				if (!user) {
					res.writeHead(404, { "Content-Type": "application/json" });
					res.end(JSON.stringify({ message: "کاربر یافت نشد." }));
					return;
				}

				// Update username if changed
				if (username && username !== currentUsername) {
					user.username = username;
				}

				// Update password if requested
				if (newPassword) {
					const hashedPassword = await bcrypt.hash(newPassword, 10);
					user.password = hashedPassword;
				}

				await user.save();

				res.writeHead(200, { "Content-Type": "application/json" });
				res.end(
					JSON.stringify({
						message: "پروفایل با موفقیت بروزرسانی شد.",
					})
				);
			} catch (err) {
				console.error("Update profile error:", err);
				res.writeHead(500, { "Content-Type": "application/json" });
				res.end(
					JSON.stringify({ message: "خطا در بروزرسانی پروفایل." })
				);
			}
		});
	}

	else if (req.url === "/api/semesters" && req.method === "GET") {
		Course.distinct("semester")
			.then((semesters) => {
				res.writeHead(200, { "Content-Type": "application/json" });
				res.end(JSON.stringify(semesters));
			})
			.catch((err) => {
				res.writeHead(500, { "Content-Type": "application/json" });
				res.end(JSON.stringify({ message: "خطا در دریافت ترم‌ها" }));
			});
	}

	else if (req.url.startsWith("/api/courses") && req.method === "GET") {
		const urlParts = new URL(req.url, `http://${req.headers.host}`);
		const semester = urlParts.searchParams.get("semester");
		if (!semester) {
			res.writeHead(400, { "Content-Type": "application/json" });
			res.end(JSON.stringify({ message: "ترم مشخص نشده است" }));
			return;
		}
		Course.find({ semester })
			.then((courses) => {
				res.writeHead(200, { "Content-Type": "application/json" });
				res.end(JSON.stringify(courses));
			})
			.catch((err) => {
				res.writeHead(500, { "Content-Type": "application/json" });
				res.end(JSON.stringify({ message: "خطا در دریافت دروس" }));
			});
	}

	else if (req.url === "/api/requests" && req.method === "GET") {
		Request.find().sort({ createdAt: -1 })
			.then((requests) => {
				res.writeHead(200, { "Content-Type": "application/json" });
				res.end(JSON.stringify(requests));
			})
			.catch((err) => {
				res.writeHead(500, { "Content-Type": "application/json" });
				res.end(JSON.stringify({ message: "خطا در دریافت درخواست‌ها" }));
			});
	}

	else if (req.url === "/api/requests" && req.method === "POST") {
		let body = "";
		req.on("data", chunk => {
			body += chunk.toString();
		});
		req.on("end", async () => {
			try {
				const { title, from, body: requestBody } = JSON.parse(body);
				const request = new Request({ title, from, body: requestBody });
				await request.save();
				res.writeHead(200, { "Content-Type": "application/json" });
				res.end(JSON.stringify({ success: true, request }));
			} catch (err) {
				res.writeHead(500, { "Content-Type": "application/json" });
				res.end(JSON.stringify({ success: false, message: "خطا در ثبت درخواست" }));
			}
		});
	}

	else if (req.url === "/api/news" && req.method === "GET") {
		News.find().sort({ createdAt: -1 })
			.then((newsItems) => {
				res.writeHead(200, { "Content-Type": "application/json" });
				res.end(JSON.stringify(newsItems));
			})
			.catch((err) => {
				res.writeHead(500, { "Content-Type": "application/json" });
				res.end(JSON.stringify({ message: "خطا در دریافت اخبار" }));
			});
	}

	else if (req.url === "/api/news" && req.method === "POST") {
		let body = "";
		req.on("data", chunk => {
			body += chunk.toString();
		});
		req.on("end", async () => {
			try {
				const { title, body: newsBody, image } = JSON.parse(body);
				const news = new News({ title, body: newsBody, image });
				await news.save();
				res.writeHead(200, { "Content-Type": "application/json" });
				res.end(JSON.stringify({ success: true, news }));
			} catch (err) {
				res.writeHead(500, { "Content-Type": "application/json" });
				res.end(JSON.stringify({ success: false, message: "خطا در ثبت خبر" }));
			}
		});
	}

	else if (req.url.startsWith("/api/finance") && req.method === "GET") {
		// دریافت وضعیت مالی و تراکنش‌های کاربر (userId از کوئری)
		const urlObj = new URL(req.url, `http://${req.headers.host}`);
		const userId = urlObj.searchParams.get("userId");

		if (!userId) {
			res.writeHead(400, { "Content-Type": "application/json" });
			return res.end(JSON.stringify({ success: false, message: "شناسه کاربر ارسال نشده است." }));
		}

		try {
			let finance = await Finance.findOne({ userId });
			if (!finance) {
			// اگر سند وجود ندارد، ایجاد سند خالی
			finance = new Finance({ userId, transactions: [] });
			await finance.save();
			}
			
			// محاسبه موجودی کلی (بستانکاری منفی = بدهی)
			let balance = 0;
			finance.transactions.forEach(t => {
			balance += t.type === "credit" ? t.amount : -t.amount;
			});

			res.writeHead(200, { "Content-Type": "application/json" });
			res.end(JSON.stringify({
			success: true,
			balance,
			transactions: finance.transactions
			}));
		} catch (error) {
			res.writeHead(500, { "Content-Type": "application/json" });
			res.end(JSON.stringify({ success: false, message: "خطا در دریافت اطلاعات مالی" }));
		}
	}

	else if (req.url === "/api/finance" && req.method === "POST") {
		let body = "";
		req.on("data", chunk => { body += chunk.toString(); });
		req.on("end", async () => {
			try {
			const { userId, amount } = JSON.parse(body);

			if (!userId || !amount || amount <= 0) {
				res.writeHead(400, { "Content-Type": "application/json" });
				return res.end(JSON.stringify({ success: false, message: "داده‌های نامعتبر" }));
			}

			let finance = await Finance.findOne({ userId });
			if (!finance) {
				finance = new Finance({ userId, transactions: [] });
			}

			finance.transactions.push({
				date: new Date(),
				desc: "پرداخت و افزایش موجودی",
				amount,
				type: "credit"
			});

			await finance.save();

			res.writeHead(200, { "Content-Type": "application/json" });
			res.end(JSON.stringify({ success: true, message: "پرداخت با موفقیت ثبت شد." }));
			} catch (error) {
			res.writeHead(500, { "Content-Type": "application/json" });
			res.end(JSON.stringify({ success: false, message: "خطا در ثبت پرداخت" }));
			}
		});
	}

	else if (req.url === "/api/finance/debt" && req.method === "POST") {
		let body = "";
		req.on("data", chunk => { body += chunk.toString(); });
		req.on("end", async () => {
			try {
			const { userId, amount, desc } = JSON.parse(body);

			if (!userId || !amount || amount <= 0 || !desc) {
				res.writeHead(400, { "Content-Type": "application/json" });
				return res.end(JSON.stringify({ success: false, message: "داده‌های نامعتبر" }));
			}

			let finance = await Finance.findOne({ userId });
			if (!finance) {
				finance = new Finance({ userId, transactions: [] });
			}

			finance.transactions.push({
				date: new Date(),
				desc,
				amount,
				type: "debit"
			});

			await finance.save();

			res.writeHead(200, { "Content-Type": "application/json" });
			res.end(JSON.stringify({ success: true, message: "بدهی با موفقیت ثبت شد." }));
			} catch (error) {
			res.writeHead(500, { "Content-Type": "application/json" });
			res.end(JSON.stringify({ success: false, message: "خطا در ثبت بدهی" }));
			}
		});
		}
	else {
		res.writeHead(404, { "Content-Type": "text/plain" });
		res.end("Page Not Found");
	}
});
