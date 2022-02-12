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
const crypto = require("crypto");

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

let games = {};
io.on("connection", (socket) => {
	socket.on("createRoom", (settings) => {
		const roomId = crypto.randomBytes(5).toString("hex");
		socket.join(roomId);
		games[roomId] = {
			players: {},
			turn: 0,
			winner: null,
			timeControl: settings.timeControl,
			fen: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
		};
		games[roomId].players[settings.username] = {
			id: socket.id,
			color:
				settings.color === "random"
					? Math.random() > 0.5
						? "white"
						: "black"
					: settings.color,
		};
		socket.emit("roomId", roomId);
	});

	socket.on("joinRoom", (newUser) => {
		console.log(newUser);
		if (!games[newUser.roomId]) {
			socket.emit("roomNotFound");
			return;
		}
		// Disable for testing purposes
		// if (socket.rooms.length > 1) {
		// 	socket.emit("roomRedirect", newUser.roomId);
		// 	return;
		// }
		if (games[newUser.roomId].players[newUser.username]) {
			console.log("already in room");
			games[newUser.roomId].players[newUser.username].id = socket.id;
			socket.join(newUser.roomId);
			socket.emit("playerJoined", games[newUser.roomId]);
			return;
		}
		if (Object.keys(games[newUser.roomId].players).length === 2) {
			socket.emit("roomFull");
			return;
		}
		let color;
		for (let key in games[newUser.roomId].players) {
			if (games[newUser.roomId].players[key].color === "black") {
				color = "white";
			} else {
				color = "black";
			}
		}
		console.log(typeof newUser.username);
		if (!games[newUser.roomId].players.hasOwnProperty(newUser.username)) {
			games[newUser.roomId].players[newUser.username] = {
				id: socket.id,
				color: color,
			};
		}
		socket.join(newUser.roomId);
		console.log(games[newUser.roomId]);
		socket.emit("playerJoined", games[newUser.roomId]);
	});

	socket.on("moveMade", (move) => {
		games[move.roomId].fen = move.fen;
		socket.broadcast.to(move.roomId).emit("opponentMoved", move);
	});

	socket.on("disconnect", () => {
		console.log("Client disconnected");
	});
});
