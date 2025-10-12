import express from "express";
import db from "../db.js";
const router = express.Router();

// 📘 Get all semesters with department name
router.get("/", (req, res) => {
  const sql = `
    SELECT 
      s.id, 
      s.title, 
      s.code, 
      s.exam_date, 
      d.title AS department_name
    FROM semesters s
    JOIN departments d ON s.department_id = d.id
    ORDER BY s.exam_date DESC
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error fetching semesters:", err);
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});

export default router;
