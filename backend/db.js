import mysql from "mysql2";

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "aniqueul85hassan", // your MySQL password if any
  database: "exam_seating_system",
});

db.connect((err) => {
  if (err) console.error("❌ Database connection failed:", err);
  else console.log("✅ Connected to MySQL Database");
});

export default db;
