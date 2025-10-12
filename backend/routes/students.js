import express from "express";
import db from "../db.js";
const router = express.Router();

// 📘 Get all students with semester title
router.get("/", (req, res) => {
  const sql = `
    SELECT 
      s.id,
      s.roll_no,
      s.full_name,
      s.seat_pref,
      sem.title AS semester_title
    FROM students s
    JOIN semesters sem ON s.semester_id = sem.id
    ORDER BY sem.title, s.roll_no
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error fetching students:", err);
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});

export default router;
