const { sql } = require("../config/dbConfig");
const jwt = require("jsonwebtoken");
const secretKey = "13659671621617612";
const bcrypt = require("bcrypt");

const registerStudent = async (req, res) => {
  const { name, email, nic, phoneNumber, password } = req.body;
  console.log(req.body);
  try {
    // to check if the emial is already registered
    const existingStudent =
      await sql.query`SELECT * FROM Students WHERE email = ${email}`;

    if (existingStudent.recordset.length > 0) {
      return res
        .status(400)
        .json({ error: "A student with this email is already registered." });
    }

    //password hashing
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    await sql.query`
      INSERT INTO Students (name, email, password, nic, phoneNumber) 
      VALUES (${name}, ${email}, ${hashedPassword}, ${nic}, ${phoneNumber})
    `;

    res.status(201).json({ message: "Student registered successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const loginStudent = async (req, res) => {
  const { email, password } = req.body;

  try {
    // retrieve all student data
    const result =
      await sql.query`SELECT * FROM Students WHERE email = ${email}`;

    if (result.recordset.length === 0) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const student = result.recordset[0];

    // to compare the entered password with the stored hashed password
    const isPasswordValid = await bcrypt.compare(password, student.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate JWT token if credentials are valid
    const token = jwt.sign(
      {
        id: student.id,
        email: student.email,
        nic: student.nic,
        phoneNumber: student.phoneNumber,
      }, // Payload
      secretKey, // Secret key
      { expiresIn: "1h" } // Token expiry time
    );

    res.status(200).json({
      message: "Login successful",
      student: {
        id: student.id,
        name: student.name,
        email: student.email,
        nic: student.nic,
        phoneNumber: student.phoneNumber,
      },
      token,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getStudentDetails = async (req, res) => {
  // Extract token from the Authorization header
  const token = req.headers.authorization?.split(" ")[1]; // Assumes "Bearer <token>" format

  if (!token) {
    return res
      .status(401)
      .json({ message: "Access token is missing or invalid" });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, secretKey);

    // Extract the student ID from the decoded token
    const studentId = decoded.id;

    // Fetch student details from the database
    const result =
      await sql.query`SELECT id, name, email,nic,phoneNumber FROM Students WHERE id = ${studentId}`;

    if (result.recordset.length) {
      const student = result.recordset[0];
      res.status(200).json({ student });
    } else {
      res.status(404).json({ message: "Student not found" });
    }
  } catch (error) {
    // Handle invalid token or other errors
    if (error.name === "JsonWebTokenError") {
      res.status(401).json({ message: "Invalid token" });
    } else if (error.name === "TokenExpiredError") {
      res.status(401).json({ message: "Token expired" });
    } else {
      res.status(500).json({ message: error.message });
    }
  }
};

const updateStudent = async (req, res) => {
  const { id } = req.params;
  const { name, email, nic, phoneNumber, password } = req.body;

  try {
    // Check if student exists
    const existingStudent =
      await sql.query`SELECT * FROM Students WHERE id = ${id}`;
    if (existingStudent.recordset.length === 0) {
      return res.status(404).json({ message: "Student not found" });
    }

    // Update student details in the database
    await sql.query`
      UPDATE Students 
      SET name = ${name}, email = ${email}, nic = ${nic}, phoneNumber = ${phoneNumber} 
      WHERE id = ${id}
    `;

    res.status(200).json({ message: "Student updated successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get student details by ID
const getStudentById = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await sql.query`SELECT * FROM Students WHERE id = ${id}`;
    if (result.recordset.length) {
      res.status(200).json({ student: result.recordset[0] });
    } else {
      res.status(404).json({ message: "Student not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteStudent = async (req, res) => {
  const { id } = req.params;

  try {
    // Check if student exists
    const existingStudent =
      await sql.query`SELECT * FROM Students WHERE id = ${id}`;
    if (existingStudent.recordset.length === 0) {
      return res.status(404).json({ message: "Student not found" });
    }

    // Delete student from the database
    await sql.query`DELETE FROM Students WHERE id = ${id}`;

    res.status(200).json({ message: "Student deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  registerStudent,
  loginStudent,
  getStudentById,
  getStudentDetails,
  updateStudent,
  deleteStudent,
};
