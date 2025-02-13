const express = require("express");
const { registerStudent, loginStudent,getStudentById, getStudentDetails, updateStudent } = require("../controllers/studentController");

const router = express.Router();

router.post("/register", registerStudent);
router.post("/login", loginStudent);
router.get("/student/:id", getStudentById);
router.put("/update/:id", updateStudent);
router.get("/studentdetails", getStudentDetails);

module.exports = router;
