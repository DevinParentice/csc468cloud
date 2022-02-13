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
		if (socket.rooms.size >= 2) {
			socket.emit("roomRedirect", Array.from(socket.rooms)[1]);
			return;
		}
		const roomId = crypto.randomBytes(5).toString("hex");
		socket.join(roomId);
		games[roomId] = {
			players: {},
			turn: 0,
			winner: null,
			vsComputer: settings.opponent === "computer",
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

		if (settings.opponent === "computer") {
			games[roomId].players["Computer"] = {
				id: "computer",
				color:
					games[roomId].players[settings.username].color === "white"
						? "black"
						: "white",
				difficulty: settings.difficulty,
			};
		}

		socket.emit("roomId", roomId);
	});

	socket.on("joinRoom", (newUser) => {
		// Check if room id is valid
		if (!games[newUser.roomId]) {
			socket.emit("roomNotFound");
			return;
		}

		// Check if user is already has a game in progress, redirect if so
		for (const [gameId, game] of Object.entries(games)) {
			for (const [key] of Object.entries(game.players)) {
				if (key === newUser.username && gameId !== newUser.roomId) {
					socket.emit("roomRedirect", gameId);
					return;
				}
			}
		}

		// Check if user is reconnecting to a game
		if (games[newUser.roomId].players[newUser.username]) {
			games[newUser.roomId].players[newUser.username].id = socket.id;
			socket.join(newUser.roomId);
			socket.emit("playerJoined", games[newUser.roomId]);
			return;
		}

		// Check to see if game already has two players
		if (Object.keys(games[newUser.roomId].players).length === 2) {
			socket.emit("roomFull");
			return;
		}

		// Determine joining players color
		let color;
		for (let key in games[newUser.roomId].players) {
			if (games[newUser.roomId].players[key].color === "black") {
				color = "white";
			} else {
				color = "black";
			}
		}

		// Add player to game
		if (!games[newUser.roomId].players.hasOwnProperty(newUser.username)) {
			games[newUser.roomId].players[newUser.username] = {
				id: socket.id,
				color: color,
			};
		}
		socket.join(newUser.roomId);
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
