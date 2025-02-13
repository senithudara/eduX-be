const sql = require("mssql/msnodesqlv8");

const config = {
  server: "localhost\\SQLEXPRESS",
  database: "eduX",
  driver: "msnodesqlv8",
  options: {
    trustedConnection: true,
  },
};

const connectDB = async () => {
  try {
    await sql.connect(config);
    console.log("Database connected successfully!");
  } catch (err) {
    console.error("Database connection failed:", err);
  }
};

module.exports = { connectDB, sql };
