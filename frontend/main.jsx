import React from "react";
import ReactDOM from "react-dom";
import "./styles/index.css";
import App from "./App";

import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/navbar/";

ReactDOM.render(
	<React.StrictMode>
		<BrowserRouter>
			<Navbar />
			<Routes>
				<Route exact path="/" element={<App />} />
			</Routes>
		</BrowserRouter>
	</React.StrictMode>,
	document.getElementById("root")
);
