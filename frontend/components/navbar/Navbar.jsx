import "./Navbar.css";
import { useState, useEffect } from "react";
import jwt_decode from "jwt-decode";

import { Link } from "react-router-dom";

export default function Navbar() {
	const [username, setUsername] = useState("");

	useEffect(() => {
		if (localStorage.getItem("authToken")) {
			const decoded = jwt_decode(localStorage.getItem("authToken"));
			setUsername(decoded.username);
		}
	}, []);

	return (
		<nav>
			<Link to="/">Chess Game</Link>
			<div>
				{username === "" ? (
					<ul>
						<li>
							<Link to="/login">Log in</Link>
						</li>
						<li>
							<Link to="/signup">Sign up</Link>
						</li>
					</ul>
				) : (
					<p>Logged in as: {username}</p>
				)}
			</div>
		</nav>
	);
}
