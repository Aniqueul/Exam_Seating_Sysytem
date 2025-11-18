import express from "express";
import db from "../db.js";
const router = express.Router();

// Get all allocated seats with plan, room, and student info
router.get("/", (req, res) => {
  const sql = `
    SELECT 
      a.id,
      a.plan_id,               -- ✅ Add plan_id here
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

// 🔄 Swap two students in a seating plan
router.post("/swap", (req, res) => {
  const { planId, student1, student2 } = req.body;

  if (!planId || !student1 || !student2) {
    return res
      .status(400)
      .json({ message: "planId, student1, and student2 are required" });
  }

  const sqlSwap = `
    UPDATE allocated_seats AS a
    JOIN allocated_seats AS b
      ON a.plan_id = ? AND b.plan_id = ? 
      AND a.student_id = ? AND b.student_id = ?
    SET a.seat_row = b.seat_row, a.seat_col = b.seat_col,
        b.seat_row = a.seat_row, b.seat_col = a.seat_col
  `;

  db.query(sqlSwap, [planId, planId, student1, student2], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Seats swapped successfully" });
  });
});

// 🟢 Get adjacency info (distance based on seat_row & seat_col)
router.get("/adjacency/:planId", (req, res) => {
  const { planId } = req.params;
  const sql = `
    SELECT s1.student_id AS student1, s2.student_id AS student2,
           ABS(s1.seat_row - s2.seat_row) + ABS(s1.seat_col - s2.seat_col) AS distance
    FROM allocated_seats s1
    JOIN allocated_seats s2 ON s1.plan_id = s2.plan_id AND s1.student_id < s2.student_id
    WHERE s1.plan_id = ?
    ORDER BY distance ASC
  `;
  db.query(sql, [planId], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

export default router;
