import express from "express";
import db from "../db.js";

const router = express.Router();

// 🧾 GET all departments
router.get("/", (req, res) => {
  db.query("SELECT * FROM departments", (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// ➕ ADD a department
router.post("/", (req, res) => {
  const { department_id, title, code, exam_date } = req.body;
  if (!department_id || !title || !code || !exam_date) {
    return res.status(400).json({ message: "All fields are required." });
  }

  const sql =
    "INSERT INTO departments (department_id, title, code, exam_date) VALUES (?, ?, ?, ?)";
  db.query(sql, [department_id, title, code, exam_date], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "✅ Department added successfully!" });
  });
});

// ✏️ UPDATE a department
router.put("/:id", (req, res) => {
  const { department_id, title, code, exam_date } = req.body;
  const { id } = req.params;

  const sql =
    "UPDATE departments SET department_id=?, title=?, code=?, exam_date=? WHERE id=?";
  db.query(sql, [department_id, title, code, exam_date, id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "✅ Department updated successfully!" });
  });
});

// ❌ DELETE a department
router.delete("/:id", (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM departments WHERE id=?", [id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "🗑️ Department deleted successfully!" });
  });
});

export default router;
