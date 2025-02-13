const { sql } = require("../config/dbConfig");

const createEnrollmentTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS Enrollments (
      id INT PRIMARY KEY IDENTITY(1,1),
      studentId INT,
      courseId INT,
      FOREIGN KEY (studentId) REFERENCES Students(id),
      FOREIGN KEY (courseId) REFERENCES Courses(id)
    )
  `;
  await sql.query(query);
};

module.exports = { createEnrollmentTable };
