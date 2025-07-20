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
