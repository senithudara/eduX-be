const { sql } = require("../config/dbConfig");

const enrollInCourse = async (req, res) => {
  const { studentId, courseId } = req.body;

  try {
    // to check if the student is already enrolled in the course
    const existingEnrollment = await sql.query`
      SELECT 1 FROM Enrollments WHERE studentId = ${studentId} AND courseId = ${courseId}
    `;

    // return message if already enrolles
    if (existingEnrollment.recordset.length > 0) {
      return res
        .status(400)
        .json({ message: "You are already enrolled in this course" });
    }

    // enroll if not enrolled already
    const result = await sql.query`
      INSERT INTO Enrollments (studentId, courseId) 
      VALUES (${studentId}, ${courseId})
    `;

    res.status(201).json({ message: "Enrolled successfully", result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//to get all the courses enrolled by a student
const getEnrolledCourses = async (req, res) => {
  const { studentId } = req.params;

  try {
    const result = await sql.query`
      SELECT c.id, c.name, c.description 
      FROM Enrollments e
      JOIN Courses c ON e.courseId = c.id
      WHERE e.studentId = ${studentId}
    `;

    if (result.recordset.length === 0) {
      return res
        .status(404)
        .json({ message: "No enrolled courses found for this student" });
    }

    res.status(200).json(result.recordset);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// unregister from a course
const unrollFromCourse = async (req, res) => {
  const { studentId, courseId } = req.params;

  try {
    const existingEnrollment = await sql.query`
      SELECT 1 FROM Enrollments WHERE studentId = ${studentId} AND courseId = ${courseId}
    `;

    if (existingEnrollment.recordset.length === 0) {
      return res
        .status(400)
        .json({ message: "Student is not enrolled in this course" });
    }

    const result = await sql.query`
      DELETE FROM Enrollments WHERE studentId = ${studentId} AND courseId = ${courseId}
    `;

    res.status(200).json({ message: "Successfully unrolled from the course" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { enrollInCourse, getEnrolledCourses, unrollFromCourse };
