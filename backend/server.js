import express from "express";
import cors from "cors";
import bcrypt from "bcryptjs";
import db from "./db.js";

// Routes
import departmentsRoute from "./routes/departments.js";
import semestersRoute from "./routes/semesters.js";
import studentsRoute from "./routes/students.js";
import roomsRoute from "./routes/rooms.js";
import seatingPlansRoute from "./routes/seatingPlans.js";
import allocatedSeatsRoute from "./routes/allocatedSeats.js";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// ✅ Authentication Routes (Register & Login)
app.post("/api/auth/register", (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password)
    return res.status(400).json({ message: "All fields are required!" });

  const checkSql = "SELECT * FROM users WHERE username = ? OR email = ?";
  db.query(checkSql, [username, email], (err, results) => {
    if (err) return res.status(500).json({ message: "Server error" });
    if (results.length > 0)
      return res
        .status(400)
        .json({ message: "Username or Email already exists!" });

    const hashedPassword = bcrypt.hashSync(password, 10);
    const insertSql =
      "INSERT INTO users (username, email, password) VALUES (?, ?, ?)";
    db.query(insertSql, [username, email, hashedPassword], (err) => {
      if (err) return res.status(500).json({ message: "Registration failed!" });
      res.json({ message: "✅ Registration successful!" });
    });
  });
});

app.post("/api/auth/login", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password)
    return res.status(400).json({ message: "All fields are required!" });

  const sql = "SELECT * FROM users WHERE username = ?";
  db.query(sql, [username], (err, results) => {
    if (err) return res.status(500).json({ message: "Server error" });
    if (results.length === 0)
      return res.status(404).json({ message: "User not found!" });

    const user = results[0];
    const isMatch = bcrypt.compareSync(password, user.password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid credentials!" });

    res.json({
      message: "✅ Login successful!",
      user: { id: user.id, username: user.username, email: user.email },
    });
  });
});

// ✅ API Routes
app.use("/api/departments", departmentsRoute);
app.use("/api/semesters", semestersRoute);
app.use("/api/students", studentsRoute);
app.use("/api/rooms", roomsRoute);
app.use("/api/seating-plans", seatingPlansRoute);
app.use("/api/allocated-seats", allocatedSeatsRoute);

// Start server
const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
