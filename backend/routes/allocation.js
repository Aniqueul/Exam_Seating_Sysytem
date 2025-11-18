const express = require("express");
const router = express.Router();
const db = require("../db");

// ---------- 1. Generate Seating Plan ----------
router.post("/generate", async (req, res) => {
  const { semesters } = req.body;

  if (!semesters || semesters.length === 0) {
    return res.status(400).json({ error: "Semesters required" });
  }

  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();

    // 1) Insert new plan
    const [planResult] = await conn.execute(
      "INSERT INTO seating_plans (title, plan_date, created_by, status) VALUES (?, NOW(), ?, ?)",
      ["Auto Generated Plan", "system", "generated"]
    );

    const planId = planResult.insertId;

    // 2) Fetch rooms
    const [rooms] = await conn.execute("SELECT * FROM rooms ORDER BY id");

    // 3) Fetch students ordered by semester + roll_no
    const placeholders = semesters.map(() => "?").join(",");
    const [students] = await conn.execute(
      `SELECT * FROM students WHERE semester_id IN (${placeholders}) ORDER BY semester_id, roll_no`,
      semesters
    );

    if (students.length === 0) {
      await conn.rollback();
      return res.status(400).json({ error: "No students found" });
    }

    // 4) Round-robin by semester
    const grouped = {};
    students.forEach((s) => {
      grouped[s.semester_id] = grouped[s.semester_id] || [];
      grouped[s.semester_id].push(s);
    });

    const semesterOrder = Object.keys(grouped).sort();
    const interleaved = [];
    let index = 0,
      keep = true;

    while (keep) {
      keep = false;
      for (let sem of semesterOrder) {
        if (grouped[sem][index]) {
          interleaved.push(grouped[sem][index]);
          keep = true;
        }
      }
      index++;
    }

    // 5) Allocate seats
    let studentIndex = 0;
    let inserts = [];

    for (let room of rooms) {
      for (let r = 1; r <= room.rows; r++) {
        for (let c = 1; c <= room.cols; c++) {
          if (studentIndex >= interleaved.length) break;

          inserts.push([planId, room.id, r, c, interleaved[studentIndex].id]);
          studentIndex++;
        }
      }
    }

    // 6) Insert in batches
    const batchSize = 200;
    for (let i = 0; i < inserts.length; i += batchSize) {
      const batch = inserts.slice(i, i + batchSize);

      const values = batch.map(() => "(?,?,?,?,?)").join(",");
      const flat = batch.flat();

      await conn.execute(
        `INSERT INTO allocated_seats 
                 (plan_id, room_id, seat_row, seat_col, student_id) 
                 VALUES ${values}`,
        flat
      );
    }

    await conn.commit();
    res.json({ success: true, planId });
  } catch (err) {
    console.error(err);
    await conn.rollback();
    res.status(500).json({ error: err.message });
  } finally {
    conn.release();
  }
});

module.exports = router;
