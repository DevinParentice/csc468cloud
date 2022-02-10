import { useState } from "react";

export default function Signup() {
	const [username, setUsername] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	const handleSubmit = async (e) => {
		e.preventDefault();

		console.log(username);
		console.log(email);
		console.log(password);
	};
	return (
		<div className="container">
			<div className="form-container">
				<div className="form-header">
					<h1>Chess Game</h1>
					<p>Signup</p>
				</div>
				<form method="POST" onSubmit={handleSubmit}>
					<input
						type="text"
						name="username"
						placeholder="Username"
						value={username}
						onChange={(e) => setUsername(e.target.value)}
					/>
					<input
						type="email"
						name="email"
						placeholder="Email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
					/>
					<input
						type="password"
						name="password"
						placeholder="Password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
					/>
					<button type="submit">Sign up</button>
				</form>
			</div>
			<div className="media"></div>
		</div>
	);
}
