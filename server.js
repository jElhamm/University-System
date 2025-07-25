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
