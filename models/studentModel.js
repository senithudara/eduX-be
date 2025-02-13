const { sql } = require("../config/dbConfig");

const createStudentTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS Students (
      id INT PRIMARY KEY IDENTITY(1,1),
      name NVARCHAR(50),
      email NVARCHAR(100) UNIQUE,
      nic NVARCHAR(50) UNIQUE,
      phoneNumber NVARCHAR(50) UNIQUE,
      password NVARCHAR(255)
    )
  `;
  await sql.query(query);
};

module.exports = { createStudentTable };
