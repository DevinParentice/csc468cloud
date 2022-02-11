import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./routes/Home/";
import Login from "./routes/Login/";
import Navbar from "./components/navbar/";
import Register from "./routes/Signup/";
import Profile from "./routes/Profile/";
import CreateGame from "./routes/Game/CreateGame";
import ActiveGame from "./routes/Game/";

import { BrowserRouter, Routes, Route } from "react-router-dom";

ReactDOM.render(
	<React.StrictMode>
		<BrowserRouter>
			<Navbar />
			<Routes>
				<Route exact path="/" element={<App />} />
				<Route exact path="/login" element={<Login />} />
				<Route exact path="/signup" element={<Register />} />
				<Route exact path="/profile/:username" element={<Profile />} />
				<Route exact path="/game/create" element={<CreateGame />} />
				<Route exact path="/game/:id" element={<ActiveGame />} />
			</Routes>
		</BrowserRouter>
	</React.StrictMode>,
	document.getElementById("root")
);
