require("dotenv").config();

const cookieParser = require("cookie-parser");
const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");

const gigRoutes = require("./routes/gigRoutes");

const skillRoutes = require("./routes/skillRoutes");

const applicationRoutes = require("./routes/applicationRoutes");

const app = express();

app.use(cookieParser());
app.use(
    cors({
        origin: "http://localhost:5173",
        credentials: true,
    })
);
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/users", userRoutes);

app.use("/gigs", gigRoutes);

app.use("/skills", skillRoutes);

app.use("/applications", applicationRoutes);

app.get("/health", (req, res) => {
    res.json({ status: "ok" });
});

const PORT = 4000;

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});