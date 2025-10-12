import express from "express";
import db from "../db.js";
const router = express.Router();

// 🏫 Get all rooms
router.get("/", (req, res) => {
  db.query("SELECT * FROM rooms ORDER BY name ASC", (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

export default router;
