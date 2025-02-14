const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const studentRoutes = require("./routes/studentRoutes");
const courseRoutes = require("./routes/courseRoutes");
const enrollmentRoutes = require("./routes/enrollmentRoutes");

const errorHandler = require("./middleware/errorHandler");
const { connectDB } = require("./config/dbConfig");
const cookieParser = require("cookie-parser");

const app = express();

app.use(cors());

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  })
);

//middleware
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));

//routes
app.use("/students", studentRoutes);
app.use("/courses", courseRoutes);
app.use("/enrollments", enrollmentRoutes);

app.use(errorHandler);

//database connetion
connectDB();

module.exports = app;
