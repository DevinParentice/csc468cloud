import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import jwt_decode from "jwt-decode";

export default function CreateGame({ socket }) {
	const navigate = useNavigate();
	let user = null;
	useEffect(() => {
		if (!localStorage.getItem("authToken")) {
			navigate("/signup");
		} else {
			user = jwt_decode(localStorage.getItem("authToken"));
		}
	}, []);

	const createRoom = (e) => {
		e.preventDefault();
		socket.emit("createRoom", {
			username: user.username,
			timeControl: "5",
			color: "random",
		});
	};

	socket.on("roomId", (roomId) => {
		navigate(`/game/${roomId}`);
	});

	return (
		<div>
			<h2>Create game</h2>
			<form onSubmit={createRoom}>
				<input type="radio" id="colorChoiceOne" name="color" value="white" />
				<label htmlFor="colorChoiceOne">White</label>
				<input type="radio" id="colorChoiceOne" name="color" value="black" />
				<label htmlFor="colorChoiceTwo">Black</label>
				<input type="radio" id="colorChoiceThree" name="color" value="random" />
				<label htmlFor="colorChoiceThree">Random</label>
				<button type="submit">Create room</button>
			</form>
		</div>
	);
}
