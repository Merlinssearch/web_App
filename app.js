// ─────────────────────────────────────────────
//  Core Modules & Middleware Setup
// ─────────────────────────────────────────────
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const createError = require("http-errors");
const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");

// ─────────────────────────────────────────────
// App Initialization
// ─────────────────────────────────────────────
const app = express();

// ─────────────────────────────────────────────
// View Engine Configuration
// ─────────────────────────────────────────────
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// ─────────────────────────────────────────────
// Middleware Stack
// ─────────────────────────────────────────────
app.use(logger("dev")); // Logging
app.use(express.json()); // JSON Payload Parser
app.use(express.urlencoded({ extended: true })); // Form Data Parser
app.use(cookieParser()); // Cookies
app.use(express.static(path.join(__dirname, "public"))); // Static Files

// ─────────────────────────────────────────────
// Routing
// ─────────────────────────────────────────────
app.use("/", indexRouter);
app.use("/users", usersRouter);

// ─────────────────────────────────────────────
// 404 Not Found Handler
// ─────────────────────────────────────────────
app.use((req, res, next) => {
  next(createError(404));
});

// ─────────────────────────────────────────────
// Global Error Handler
// ─────────────────────────────────────────────
app.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  res.status(err.status || 500);
  res.render("error");
});

// ─────────────────────────────────────────────
// Export App
// ─────────────────────────────────────────────
module.exports = app;
