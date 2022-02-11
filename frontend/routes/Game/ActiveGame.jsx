import { useEffect } from "react";
import Board from "../../components/Board";
import io from "socket.io-client";

const endpoint = "http://localhost:5000";

export default function ActiveGame() {
	useEffect(() => {
		const socket = io(endpoint);
		socket.on("connect", () => {
			console.log("Connected to server");
		});
	}, []);

	return (
		<div>
			<Board />
		</div>
	);
}
