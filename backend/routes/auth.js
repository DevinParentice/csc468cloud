const express = require("express");

// userRoutes is an instance of the express router.
// We use it to define our routes.
// The router will be added as a middleware and will take control of requests starting with path /user.
const userRoutes = express.Router();

const { signup, login } = require("../controllers/auth");

// This section will help you create a new user.
userRoutes.route("/user/signup").post(signup);

// This section will help you login a user.
userRoutes.route("/user/login").post(login);

module.exports = userRoutes;
