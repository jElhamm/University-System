# University System

A full-stack web application for managing university services including food reservations, course management, news, requests, and financial transactions.

## Features

- **User Authentication**: Sign up and login with secure password hashing
- **Food Reservation**: Browse and reserve meals from university restaurants
- **Course Management**: View courses by semester
- **News System**: Read and post university news
- **Request System**: Submit and manage requests
- **Finance Management**: Track transactions and balance
- **Dashboard**: Centralized user dashboard

## Tech Stack

- **Backend**: Node.js with HTTP server
- **Database**: MongoDB with Mongoose
- **Frontend**: Vanilla JavaScript, HTML, CSS
- **Authentication**: bcrypt for password hashing

## Prerequisites

- Node.js
- MongoDB (running on localhost:27017)

## Installation

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

3. Make sure MongoDB is running on `mongodb://127.0.0.1:27017`

4. Start the server:
```bash
npm start
```

5. Open your browser and navigate to `http://localhost:3001`

## Project Structure

```
University-System/
├── server.js          # Main server file
├── db.js              # Database models and connection
├── public/            # Frontend files
│   ├── *.html         # HTML pages
│   ├── *.js           # Client-side JavaScript
│   ├── *.css          # Stylesheets
│   └── image/         # Image assets
└── package.json       # Dependencies
```

## License

ISC

