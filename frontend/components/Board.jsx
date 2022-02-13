import { Chess } from "chess.js";

import { Chessboard } from "react-chessboard";
import { useState } from "react";
import { Game, aiMove, getFen } from "js-chess-engine";

export default function Board({ socket, roomId, user }) {
	const [game, setGame] = useState(new Chess());
	const [aiGame, setAiGame] = useState(new Game());
	const [gameState, setGameState] = useState({});
	const [fen, setFen] = useState(game.fen());
	const [opponent, setOpponent] = useState("");
	const [boardOrientation, setBoardOrientation] = useState("white");
	const [rightClickedSquares, setRightClickedSquares] = useState({});
	const [optionSquares, setOptionSquares] = useState({});

	function safeGameMutate(modify) {
		setGame((g) => {
			const update = { ...g };
			modify(update);
			return update;
		});
	}

	function getMoveOptions(square) {
		const moves = game.moves({
			square,
			verbose: true,
		});
		if (moves.length === 0) {
			return;
		}

		const newSquares = {};
		moves.map((move) => {
			newSquares[move.to] = {
				background:
					game.get(move.to) &&
					game.get(move.to).color !== game.get(square).color
						? "radial-gradient(circle, rgba(0,0,0,.1) 85%, transparent 85%)"
						: "radial-gradient(circle, rgba(0,0,0,.1) 25%, transparent 25%)",
				borderRadius: "50%",
			};
			return move;
		});
		setOptionSquares(newSquares);
	}

	function onMouseOverSquare(square) {
		getMoveOptions(square);
	}

	// Only set squares to {} if not already set to {}
	function onMouseOutSquare() {
		if (Object.keys(optionSquares).length !== 0) setOptionSquares({});
	}

	function onSquareClick() {
		setRightClickedSquares({});
	}

	function onSquareRightClick(square) {
		const color = "rgba(0, 0, 255, 0.4)";
		setRightClickedSquares({
			...rightClickedSquares,
			[square]:
				rightClickedSquares[square] &&
				rightClickedSquares[square].backgroundColor === color
					? undefined
					: { backgroundColor: color },
		});
	}

	function onDrop(sourceSquare, targetSquare) {
		let move = null;
		if (game.turn() !== gameState.players[user["username"]].color.charAt(0))
			return false;
		safeGameMutate((game) => {
			move = game.move({
				from: sourceSquare,
				to: targetSquare,
				promotion: "q", // always promote to a queen for example simplicity
			});
		});
		if (move === null) return false; // illegal move
		if (gameState.vsComputer === true) {
			setFen(game.fen());
			makeComputerMove(gameState);
		} else {
			socket.emit("moveMade", {
				roomId,
				fen: game.fen(),
				move: game.history()[game.history().length - 1],
			});
			setFen(game.fen());
		}
		return true;
	}

	function makeComputerMove(gameState) {
		let move = null;
		const chosenMove = aiMove(
			game.fen(),
			gameState.players["Computer"]["difficulty"]
		);
		for (const [fromSquare, toSquare] of Object.entries(chosenMove)) {
			safeGameMutate((game) => {
				move = game.move({
					from: fromSquare.toLowerCase(),
					to: toSquare.toLowerCase(),
					promotion: "q", // always promote to a queen for example simplicity
				});
			});
		}
		setFen(game.fen());
	}

	socket.on("playerJoined", (gameState) => {
		setGameState(gameState);
		for (const [key] of Object.entries(gameState.players)) {
			if (key !== user["username"]) {
				setOpponent(key);
			}
		}
		game.load(gameState.fen);
		setFen(gameState.fen);
		setBoardOrientation(gameState.players[user["username"]].color);
		if (
			gameState &&
			gameState.vsComputer === true &&
			gameState.players["Computer"].color.charAt(0) === game.turn()
		) {
			makeComputerMove(gameState);
		}
	});

	socket.on("opponentMoved", (move) => {
		game.move(move.move);
		setFen(game.fen());
	});

	return (
		<>
			<p>{opponent}</p>
			<Chessboard
				position={fen}
				onMouseOverSquare={onMouseOverSquare}
				onMouseOutSquare={onMouseOutSquare}
				onSquareClick={onSquareClick}
				onSquareRightClick={onSquareRightClick}
				onPieceDrop={onDrop}
				boardOrientation={boardOrientation}
				id="BoardExample"
				customBoardStyle={{
					borderRadius: "4px",
					boxShadow: "0 5px 15px rgba(0, 0, 0, 0.5)",
				}}
				customSquareStyles={{
					...optionSquares,
					...rightClickedSquares,
				}}
				boardWidth={600}
			/>
			<p>{user["username"]}</p>
		</>
	);
}
