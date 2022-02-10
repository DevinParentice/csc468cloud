const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const UserSchema = new mongoose.Schema(
	{
		username: {
			type: String,
			required: [true, "Please enter a username"],
			unique: [true, "Username already exists"],
		},
		email: {
			type: String,
			required: [true, "Please enter an email"],
			unique: [true, "An account with this email already exists"],
			match: [
				/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
				"Please provide a valid email",
			],
		},
		password: {
			type: String,
			required: [true, "Please enter a password"],
			minlength: 8,
			select: false,
		},
	},
	{
		collection: "Users",
	}
);

UserSchema.pre("save", async function (next) {
	const salt = await bcrypt.genSalt(10);
	this.password = await bcrypt.hash(this.password, salt);
	next();
});

UserSchema.methods.matchPassword = async function (enteredPassword) {
	return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", UserSchema);

module.exports = User;