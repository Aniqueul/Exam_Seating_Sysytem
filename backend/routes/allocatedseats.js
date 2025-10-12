import express from "express";
import db from "../db.js";
const router = express.Router();

// Get all allocated seats with plan, room, and student info
router.get("/", (req, res) => {
  const sql = `
    SELECT 
      a.id,
      sp.title AS plan_title,
      r.name AS room_name,
      a.seat_row,
      a.seat_col,
      s.full_name AS student_name
    FROM allocated_seats a
    JOIN seating_plans sp ON a.plan_id = sp.id
    JOIN rooms r ON a.room_id = r.id
    JOIN students s ON a.student_id = s.id
    ORDER BY sp.title, r.name, a.seat_row, a.seat_col
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error fetching allocated seats:", err);
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});

export default router;
