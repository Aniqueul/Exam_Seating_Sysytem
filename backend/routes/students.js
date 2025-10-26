import express from "express";
import db from "../db.js";

const router = express.Router();

// 📘 Get all students with semester title
router.get("/", (req, res) => {
  const sql = `
    SELECT 
      s.id,
      s.semester_id,
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

// ➕ Add a new student
router.post("/", (req, res) => {
  const { semester_id, roll_no, full_name, seat_pref } = req.body;
  if (!semester_id || !roll_no || !full_name) {
    return res
      .status(400)
      .json({ message: "All required fields must be provided." });
  }

  const sql =
    "INSERT INTO students (semester_id, roll_no, full_name, seat_pref) VALUES (?, ?, ?, ?)";
  db.query(
    sql,
    [semester_id, roll_no, full_name, seat_pref || null],
    (err, result) => {
      if (err) {
        console.error("Error adding student:", err);
        return res.status(500).json({ error: err.message });
      }
      res.json({ message: "✅ Student added successfully!" });
    }
  );
});

// ✏️ Update student
router.put("/:id", (req, res) => {
  const { semester_id, roll_no, full_name, seat_pref } = req.body;
  const { id } = req.params;

  if (!semester_id || !roll_no || !full_name) {
    return res
      .status(400)
      .json({ message: "All required fields must be provided." });
  }

  const sql =
    "UPDATE students SET semester_id=?, roll_no=?, full_name=?, seat_pref=? WHERE id=?";
  db.query(
    sql,
    [semester_id, roll_no, full_name, seat_pref || null, id],
    (err, result) => {
      if (err) {
        console.error("Error updating student:", err);
        return res.status(500).json({ error: err.message });
      }
      res.json({ message: "✅ Student updated successfully!" });
    }
  );
});

// ❌ Delete student
router.delete("/:id", (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM students WHERE id=?", [id], (err, result) => {
    if (err) {
      console.error("Error deleting student:", err);
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: "🗑️ Student deleted successfully!" });
  });
});

export default router;
