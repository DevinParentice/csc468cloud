import "./ActiveGame.css";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Board from "../../components/Board";
import jwt_decode from "jwt-decode";

export default function ActiveGame({ socket }) {
	const params = useParams();
	const navigate = useNavigate();
	if (!localStorage.getItem("authToken")) {
		navigate("/signup");
		return;
	}
	const [user, setUser] = useState(
		jwt_decode(localStorage.getItem("authToken"))
	);

	socket.emit("joinRoom", {
		username: user.username,
		roomId: params.id,
	});

	socket.on("roomNotFound", () => {
		navigate("/game/create");
	});

	return (
		<div className="board-container">
			<Board socket={socket} roomId={params.id} user={user} />
		</div>
	);
}
