require("dotenv").config({ path: "./config.env" });
const express = require("express");
const app = express();
const cors = require("cors");
const port = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());
app.use(require("./routes/auth"));
app.use("/profile", require("./routes/profile"));
// get driver connection
const connectDB = require("./db/conn");
const errorHandler = require("./middleware/error");

connectDB();

app.use(errorHandler);
const http = require("http").Server(app);
const io = require("socket.io")(http, {
	cors: {
		origin: "*",
		methods: ["GET", "POST", "PUT", "DELETE"],
	},
});

http.listen(port, () => {
	console.log(`Server is running on port: ${port}`);
});

io.on("connection", (socket) => {
	console.log("New user connected");
	socket.on("disconnect", () => {
		console.log();
	});
});
