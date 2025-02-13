const express = require("express");
const bodyParser = require("body-parser");
const cors = require('cors')

const studentRoutes = require("./routes/studentRoutes");
const courseRoutes = require("./routes/courseRoutes");
const enrollmentRoutes = require("./routes/enrollmentRoutes");

const errorHandler = require("./middleware/errorHandler");
const { connectDB } = require("./config/dbConfig");
const cookieParser = require('cookie-parser')

const app = express(); 

app.use(cors()); // This will allow requests from all domains

// If you want to allow only specific domains, you can do:
app.use(cors({
  origin: 'http://localhost:5173', // Replace with your frontend URL
  methods: ['GET', 'POST'],
  credentials: true,
}));

// Middleware
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.urlencoded({extended:false}));

// Routes
app.use("/students", studentRoutes);
app.use("/courses", courseRoutes);
app.use("/enrollments", enrollmentRoutes);

// Error handler
app.use(errorHandler);

// Connect to DB
connectDB();

module.exports = app;
