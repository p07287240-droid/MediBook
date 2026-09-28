const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

const connectDB = require("./config/db");

const authRoutes = require("./routes/auth");
const doctorsRoutes = require("./routes/doctors");
const appointmentsRoutes = require("./routes/appointments");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/doctors", doctorsRoutes);
app.use("/api/appointments", appointmentsRoutes);

connectDB();

app.get("/", (req, res) => {
  res.json({
    message: "MediBook API is running",
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});