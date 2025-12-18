const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();

const cookieParser = require("cookie-parser");

app.use(
  cors({
    origin: ["http://localhost:3000", "https://blog-application-yqez.onrender.com"],
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());
mongoose
  .connect(process.env.MONGO_URI || process.env.MONGO_URL, {
  })
  .then(() => console.info("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));


app.get("/", (req, res) => {
  res.send("Welcome to the Blog API");
});

app.use("/api/auth", require("./routes/auth"));
app.use("/api/blogs", require("./routes/blogs"));
app.use("/api/comments", require("./routes/comments"));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.info(`Server running on port ${PORT}`);
});
