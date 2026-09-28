const express = require("express");

const Appointment = require("../models/Appointment");
const Doctor = require("../models/Doctor");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", authMiddleware, async (req, res) => {
  try {
    const { doctorId, date, timeSlot } = req.body;

    if (!doctorId || !date || !timeSlot) {
      return res.status(400).json({message: "Doctor, date and time slot are required",});
    }
    const doctor = await Doctor.findById(doctorId);

    if (!doctor) {
      return res.status(404).json({message: "Doctor not found",});
    }
    const existingAppointment = await Appointment.findOne({doctor: doctorId, date, timeSlot, status: "booked",});
    if (existingAppointment) {
      return res.status(409).json({message: "This time slot is already booked",});
    }
    const appointment = await Appointment.create({ patient: req.user.id, doctor: doctorId, date, timeSlot, status: "booked",});
    const populatedAppointment = await Appointment.findById(
      appointment._id
    )
      .populate("doctor", "name specialization experience photoUrl")
      .populate("patient", "name email");
    res.status(201).json({ message: "Appointment booked successfully", appointment: populatedAppointment,});
  } catch (error) {
    console.error("Book appointment error:", error);
    res.status(500).json({message: "Failed to book appointment",});
  }
});
router.get("/my", authMiddleware, async (req, res) => {
  try {
    const appointments = await Appointment.find({patient: req.user.id,})
      .populate("doctor", "name specialization experience photoUrl")
      .sort({ date: 1, timeSlot: 1 });
    res.json(appointments);
  } catch (error) {
    console.error("Get appointments error:", error);
    res.status(500).json({message: "Failed to fetch appointments",});
  }
});
router.put("/:id/cancel", authMiddleware, async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({message: "Appointment not found",});
    }
    if (appointment.patient.toString() !== req.user.id) {
      return res.status(403).json({message: "You are not allowed to cancel this appointment",});
    }

    if (appointment.status === "cancelled") {
      return res.status(400).json({message: "Appointment is already cancelled",});
    }
    appointment.status = "cancelled";
    await appointment.save();
    res.json({message: "Appointment cancelled successfully", appointment,});
  } catch (error) {
    console.error("Cancel appointment error:", error);
    res.status(500).json({message: "Failed to cancel appointment",});
  }
});

module.exports = router;