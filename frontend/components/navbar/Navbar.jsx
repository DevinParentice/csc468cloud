import "./Navbar.css";

import { Link } from "react-router-dom";

export default function Navbar() {
	return (
		<nav>
			<Link to="/">Chess Game</Link>
			<div>
				<ul>
					<li>
						<Link to="/login">Log in</Link>
					</li>
					<li>
						<Link to="/signup">Sign up</Link>
					</li>
				</ul>
			</div>
		</nav>
	);
}
