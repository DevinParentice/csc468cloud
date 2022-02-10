import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./routes/Home/";
import Login from "./routes/Login/";
import Navbar from "./components/navbar/";
import Register from "./routes/Signup/";

import { BrowserRouter, Routes, Route } from "react-router-dom";

ReactDOM.render(
	<React.StrictMode>
		<BrowserRouter>
			<Navbar />
			<Routes>
				<Route exact path="/" element={<App />} />
				<Route exact path="/login" element={<Login />} />
				<Route exact path="/signup" element={<Register />} />
			</Routes>
		</BrowserRouter>
	</React.StrictMode>,
	document.getElementById("root")
);
