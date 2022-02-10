require("dotenv").config({ path: "./config.env" });
const express = require("express");
const app = express();
const cors = require("cors");
const port = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());
app.use(require("./routes/auth"));
// get driver connection
const connectDB = require("./db/conn");
const errorHandler = require("./middleware/error");

connectDB();

app.use(errorHandler);

app.listen(port, () => {
	console.log(`Server is running on port: ${port}`);
});
