const express = require("express");
const { enrollInCourse, getEnrolledCourses, unrollFromCourse } = require("../controllers/enrollmentController");

const router = express.Router();

router.post("/", enrollInCourse);
router.get("/enrolledCourses/:studentId", getEnrolledCourses);
router.delete("/unroll/:studentId/:courseId", unrollFromCourse);

module.exports = router;
