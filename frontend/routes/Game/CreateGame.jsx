import { Link } from "react-router-dom";

export default function CreateGame() {
	return (
		<div>
			<h2>Create game</h2>
			<Link to={`/game/${(Math.random() + 1).toString(36).substring(7)}`}>
				Start game
			</Link>
		</div>
	);
}
