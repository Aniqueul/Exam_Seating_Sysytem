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

export default router;
