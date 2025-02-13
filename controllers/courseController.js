const { sql } = require("../config/dbConfig");

const getCourses = async (req, res) => {
  try {
    const result = await sql.query`SELECT * FROM Courses`;
    res.status(200).json(result.recordset);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getCourses };
