import express from "express";
import db from "../db.js";
const router = express.Router();

// 🪑 Get all seating plans
router.get("/", (req, res) => {
  const sql = `
    SELECT id, title, plan_date, status
    FROM seating_plans
    ORDER BY plan_date DESC
  `;
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// 🪑 Generate a new seating plan (Week-3 feature, row & column)
router.post("/generate", (req, res) => {
  const { title, plan_date, students, room_id, rows, cols } = req.body;

  if (
    !title ||
    !plan_date ||
    !students ||
    students.length === 0 ||
    !room_id ||
    !rows ||
    !cols
  ) {
    return res
      .status(400)
      .json({
        message:
          "Title, plan_date, students, room_id, rows, and cols are required",
      });
  }

  if (students.length > rows * cols) {
    return res
      .status(400)
      .json({ message: "Not enough seats for all students" });
  }

  // Shuffle students randomly
  const shuffledStudents = students.sort(() => Math.random() - 0.5);

  // Insert new seating plan
  const sqlPlan = `INSERT INTO seating_plans (title, plan_date, status) VALUES (?, ?, 'generated')`;
  db.query(sqlPlan, [title, plan_date], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });

    const planId = result.insertId;
    const allocations = [];
    let studentIndex = 0;

    for (let r = 1; r <= rows; r++) {
      for (let c = 1; c <= cols; c++) {
        if (studentIndex >= shuffledStudents.length) break;
        allocations.push([
          planId,
          shuffledStudents[studentIndex],
          room_id,
          r,
          c,
        ]);
        studentIndex++;
      }
    }

    const sqlAlloc = `
      INSERT INTO allocated_seats (plan_id, student_id, room_id, seat_row, seat_col)
      VALUES ?
    `;
    db.query(sqlAlloc, [allocations], (err2) => {
      if (err2) return res.status(500).json({ error: err2.message });
      res.json({ message: "Seating plan generated", planId, allocations });
    });
  });
});

export default router;
