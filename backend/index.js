const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
require("./cronJobs");
dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/auth", require("./routes/auth"));
app.use("/posts", require("./routes/posts"));
app.use("/admin", require("./routes/admin"));
app.use("/activity", require("./routes/activity"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
