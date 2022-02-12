import { Chess } from "chess.js";

import { Chessboard } from "react-chessboard";
import { useState } from "react";

export default function Board({ socket, roomId, user }) {
	const [game, setGame] = useState(new Chess());
	const [gameState, setGameState] = useState({});
	const [fen, setFen] = useState(game.fen());
	const [boardOrientation, setBoardOrientation] = useState("white");

	function safeGameMutate(modify) {
		setGame((g) => {
			const update = { ...g };
			modify(update);
			return update;
		});
	}

	function makeRandomMove() {
		const possibleMoves = game.moves();
		if (game.game_over() || game.in_draw() || possibleMoves.length === 0)
			return; // exit if the game is over
		const randomIndex = Math.floor(Math.random() * possibleMoves.length);
		safeGameMutate((game) => {
			game.move(possibleMoves[randomIndex]);
		});
	}

	function onDrop(sourceSquare, targetSquare) {
		let move = null;
		if (game.turn() !== gameState.players[user["username"]].color.charAt(0))
			return;
		safeGameMutate((game) => {
			move = game.move({
				from: sourceSquare,
				to: targetSquare,
				promotion: "q", // always promote to a queen for example simplicity
			});
		});
		if (move === null) return false; // illegal move
		socket.emit("moveMade", {
			roomId,
			fen: game.fen(),
			move: game.history()[game.history().length - 1],
		});
		setFen(game.fen());
		return true;
	}

	socket.on("playerJoined", (gameState) => {
		setGameState(gameState);
		game.load(gameState.fen);
		setFen(gameState.fen);
		setBoardOrientation(gameState.players[user["username"]].color);
	});

	socket.on("opponentMoved", (move) => {
		game.move(move.move);
		setFen(game.fen());
	});

	return (
		<Chessboard
			position={fen}
			onPieceDrop={onDrop}
			boardOrientation={boardOrientation}
			id="BoardExample"
		/>
	);
}
