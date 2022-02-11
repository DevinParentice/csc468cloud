import "./styles/App.css";
import { Chessboard } from "react-chessboard";

function App() {
	return (
		<div className="App">
			<h1>Chess Game</h1>
			<p>
				Edit this page at: <code>frontend/App.jsx</code>
			</p>
			<Chessboard id="BoardExample" />
		</div>
	);
}

export default App;
