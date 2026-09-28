const mongoose = require("mongoose");
const dotenv = require("dotenv");

const Doctor = require("./models/Doctor");
dotenv.config();
const doctors = [
  {
    name: "Dr. Priya Sharma",
    specialization: "Cardiologist",
    experience: 12,
    availableSlots: [
      "09:00 AM",
      "10:00 AM",
      "11:00 AM",
      "02:00 PM",
      "03:00 PM",
    ],
    photoUrl: "",
  },
  {
    name: "Dr. Arun Kumar",
    specialization: "Dermatologist",
    experience: 8,
    availableSlots: [
      "09:30 AM",
      "10:30 AM",
      "11:30 AM",
      "02:30 PM",
      "04:00 PM",
    ],
    photoUrl: "",
  },
  {
    name: "Dr. Meena Raj",
    specialization: "Pediatrician",
    experience: 10,
    availableSlots: [
      "09:00 AM",
      "10:00 AM",
      "12:00 PM",
      "03:00 PM",
      "04:00 PM",
    ],
    photoUrl: "",
  },
  {
    name: "Dr. Rahul Verma",
    specialization: "Neurologist",
    experience: 15,
    availableSlots: [
      "10:00 AM",
      "11:00 AM",
      "01:00 PM",
      "03:00 PM",
      "05:00 PM",
    ],
    photoUrl: "",
  },
  {
    name: "Dr. Anitha Kumar",
    specialization: "Gynecologist",
    experience: 9,
    availableSlots: [
      "09:00 AM",
      "11:00 AM",
      "12:00 PM",
      "02:00 PM",
      "04:00 PM",
    ],
    photoUrl: "",
  },
];
const seedDoctors = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");
    await Doctor.deleteMany();
    await Doctor.insertMany(doctors);
    console.log("Doctors seeded successfully");
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error("Seed error:", error.message);

    process.exit(1);
  }
};

seedDoctors();