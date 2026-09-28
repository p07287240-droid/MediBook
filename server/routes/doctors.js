const express = require("express");
const Doctor = require("../models/Doctor");
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const doctors = await Doctor.find().sort({ name: 1 });
    res.json(doctors);
  } catch (error) {
    console.error("Get doctors error:", error);
    res.status(500).json({message: "Failed to fetch doctors",});
  }
});

router.get("/:id", async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) {
      return res.status(404).json({message: "Doctor not found",});
    }
    res.json(doctor);
  } catch (error) {
    console.error("Get doctor error:", error);
    res.status(500).json({message: "Failed to fetch doctor",});
  }
});

module.exports = router;