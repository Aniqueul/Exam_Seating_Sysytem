import express from "express";
import db from "../db.js";

const router = express.Router();

// GET all rooms
router.get("/", (req, res) => {
  db.query("SELECT * FROM rooms ORDER BY name ASC", (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// ADD room
router.post("/", (req, res) => {
  const { code, name, capacity, rows, cols } = req.body;
  if (!code || !name || !capacity || !rows || !cols)
    return res.status(400).json({ message: "All fields are required." });

  const sql =
    "INSERT INTO rooms (code, name, capacity, `rows`, `cols`) VALUES (?, ?, ?, ?, ?)";
  db.query(sql, [code, name, capacity, rows, cols], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "✅ Room added successfully!" });
  });
});

// UPDATE room
router.put("/:id", (req, res) => {
  const { code, name, capacity, rows, cols } = req.body;
  const { id } = req.params;

  const sql =
    "UPDATE rooms SET code=?, name=?, capacity=?, `rows`=?, `cols`=? WHERE id=?";
  db.query(sql, [code, name, capacity, rows, cols, id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "✅ Room updated successfully!" });
  });
});

// DELETE room
router.delete("/:id", (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM rooms WHERE id=?", [id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "🗑️ Room deleted successfully!" });
  });
});

export default router;
