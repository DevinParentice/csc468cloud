const express = require("express");

const User = require("../models/User");

// userRoutes is an instance of the express router.
// We use it to define our routes.
// The router will be added as a middleware and will take control of requests starting with path /record.
const userRoutes = express.Router();

// This will help us connect to the database
const res = require("express/lib/response");

const { signup, login } = require("../controllers/auth");

// This section will help you get a single user by id
userRoutes.route("/user/:id").get(function (req, res) {
	// TODO
});

// This section will help you create a new user.
userRoutes.route("/user/signup").post(signup);

// This section will help you login a user.
userRoutes.route("/user/login").post(login);

module.exports = userRoutes;
