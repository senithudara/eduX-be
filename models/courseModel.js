const { sql } = require("../config/dbConfig");

const createCourseTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS Courses (
      id INT PRIMARY KEY IDENTITY(1,1),
      name NVARCHAR(50)
      description NVARCHAR(255)
    )
  `;
  await sql.query(query);
};

module.exports = { createCourseTable };
