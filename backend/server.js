import express from "express";
import cors from "cors";
import db from "./db.js";

import departmentsRoute from "./routes/departments.js";
import semestersRoute from "./routes/semesters.js";
import studentsRoute from "./routes/students.js";
import roomsRoute from "./routes/rooms.js";
import seatingPlansRoute from "./routes/seatingPlans.js";
import allocatedSeatsRoute from "./routes/allocatedSeats.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/departments", departmentsRoute);
app.use("/api/semesters", semestersRoute);
app.use("/api/students", studentsRoute);
app.use("/api/rooms", roomsRoute);
app.use("/api/seating-plans", seatingPlansRoute);
app.use("/api/allocated-seats", allocatedSeatsRoute);

const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
