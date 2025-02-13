const { sql } = require("../config/dbConfig");

const enrollInCourse = async (req, res) => {
  const { studentId, courseId } = req.body;

  try {
    // Check if the student is already enrolled in the course
    const existingEnrollment = await sql.query`
      SELECT 1 FROM Enrollments WHERE studentId = ${studentId} AND courseId = ${courseId}
    `;

    // If the enrollment already exists, return a message indicating so
    if (existingEnrollment.recordset.length > 0) {
      return res.status(400).json({ message: "Student is already enrolled in this course" });
    }

    // If no existing enrollment, proceed to insert
    const result = await sql.query`
      INSERT INTO Enrollments (studentId, courseId) 
      VALUES (${studentId}, ${courseId})
    `;

    res.status(201).json({ message: "Enrolled successfully", result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Get enrolled courses for a student
const getEnrolledCourses = async (req, res) => {
  const { studentId } = req.params; // Get studentId from request parameters

  try {
    // Fetch all courses the student is enrolled in
    const result = await sql.query`
      SELECT c.id, c.name, c.description 
      FROM Enrollments e
      JOIN Courses c ON e.courseId = c.id
      WHERE e.studentId = ${studentId}
    `;

    // If no enrollments found
    if (result.recordset.length === 0) {
      return res.status(404).json({ message: "No enrolled courses found for this student" });
    }

    // Return the list of enrolled courses
    res.status(200).json(result.recordset);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Unroll from a course
const unrollFromCourse = async (req, res) => {
  const { studentId, courseId } = req.params; // Get studentId and courseId from request parameters

  try {
    // Check if the student is enrolled in the course
    const existingEnrollment = await sql.query`
      SELECT 1 FROM Enrollments WHERE studentId = ${studentId} AND courseId = ${courseId}
    `;

    // If the enrollment doesn't exist, return a message indicating so
    if (existingEnrollment.recordset.length === 0) {
      return res.status(400).json({ message: "Student is not enrolled in this course" });
    }

    // If enrollment exists, proceed to delete it
    const result = await sql.query`
      DELETE FROM Enrollments WHERE studentId = ${studentId} AND courseId = ${courseId}
    `;

    // If successful, send a response indicating the student was unrolled
    res.status(200).json({ message: "Successfully unrolled from the course" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { enrollInCourse ,getEnrolledCourses,unrollFromCourse};
