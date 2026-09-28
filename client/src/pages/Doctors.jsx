import { useEffect, useMemo, useState } from "react";
import axios from "axios";

const fallbackDoctors = [
  { name: "Dr. Shalini Rao", specialization: "Cardiologist", experience: 12, rating: "4.8", photoUrl: "" },
  { name: "Dr. Vivek Kumar", specialization: "Dermatologist", experience: 8, rating: "4.6", photoUrl: "" },
  { name: "Dr. Anitha N", specialization: "Pediatrician", experience: 15, rating: "4.9", photoUrl: "" },
  { name: "Dr. Rahul S", specialization: "Orthopedic", experience: 10, rating: "4.7", photoUrl: "" },
  { name: "Dr. Meera Iyer", specialization: "Cardiologist", experience: 9, rating: "4.8", photoUrl: "" },
  { name: "Dr. Arjun Das", specialization: "Dermatologist", experience: 11, rating: "4.7", photoUrl: "" },
];
const specialties = ["All", "Cardiologist", "Dermatologist", "Pediatrician", "Orthopedic"];
const slots = ["10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM", "02:00 PM", "02:30 PM"];
const dates = [
  { day: "MON", date: 24 }, { day: "TUE", date: 25 },
  { day: "WED", date: 26 }, { day: "THU", date: 27 },
];
const colors = ["#15998e", "#edae43", "#ef7966", "#7182d3", "#42a899", "#e28b56"];

function Doctors() {
  const [doctors, setDoctors] = useState(fallbackDoctors);
  const [specialty, setSpecialty] = useState("All");
  const [selected, setSelected] = useState(0);
  const [date, setDate] = useState(25);
  const [slot, setSlot] = useState("11:00 AM");
  const [notice, setNotice] = useState("");
  const [slotOverrides, setSlotOverrides] = useState(() => JSON.parse(localStorage.getItem("doctorSlots") || "{}"));
  const [manageSlots, setManageSlots] = useState(false);
  const [slotInput, setSlotInput] = useState("");
  const [editingSlot, setEditingSlot] = useState("");

  useEffect(() => {
    axios.get("http://localhost:5000/api/doctors").then(({ data }) => {
      if (Array.isArray(data) && data.length) setDoctors([...data.map((doctor, i) => ({ ...fallbackDoctors[i % fallbackDoctors.length], ...doctor })), ...fallbackDoctors.filter((fallback) => !data.some((doctor) => doctor.specialization?.toLowerCase() === fallback.specialization.toLowerCase()))]);
    }).catch(() => {});
  }, []);

  const visibleDoctors = useMemo(() => specialty === "All" ? doctors : doctors.filter((doctor) => doctor.specialization?.toLowerCase() === specialty.toLowerCase()), [doctors, specialty]);
  const activeDoctor = visibleDoctors[selected] || visibleDoctors[0];
  const doctorKey = activeDoctor?._id || activeDoctor?.name;
  const doctorSchedule = doctorKey ? (slotOverrides[doctorKey] || activeDoctor.availableSlots || (activeDoctor.specialization?.toLowerCase() === "orthopedic" ? ["09:00 AM", "10:00 AM", "11:00 AM", "01:30 PM", "02:30 PM", "04:00 PM"] : slots.filter((_, index) => index !== 1 && index !== 4))) : [];
  const timeToLabel = (value) => { const parts = value.split(":"); const hour = Number(parts[0]); return (hour % 12 || 12) + ":" + parts[1] + " " + (hour >= 12 ? "PM" : "AM"); };
  const labelToTime = (value) => { const parts = value.split(" "); const time = parts[0].split(":"); let hour = Number(time[0]); if (parts[1] === "PM" && hour !== 12) hour += 12; if (parts[1] === "AM" && hour === 12) hour = 0; return String(hour).padStart(2, "0") + ":" + time[1]; };
  const saveSchedule = (next) => { const updated = { ...slotOverrides, [doctorKey]: next }; setSlotOverrides(updated); localStorage.setItem("doctorSlots", JSON.stringify(updated)); };
  const addOrUpdateSlot = (event) => { event.preventDefault(); if (!slotInput) return; const label = timeToLabel(slotInput); const next = [...doctorSchedule]; if (editingSlot) { const index = next.indexOf(editingSlot); if (index >= 0) next[index] = label; } else if (!next.includes(label)) next.push(label); next.sort((a, b) => labelToTime(a).localeCompare(labelToTime(b))); saveSchedule(next); setSlot(label); setSlotInput(""); setEditingSlot(""); };
  const removeSlot = (item) => { const next = doctorSchedule.filter((value) => value !== item); saveSchedule(next); if (slot === item) setSlot(next[0] || ""); };

  useEffect(() => {
    if (activeDoctor) setSelected(0);
  }, [specialty]);

  const confirmBooking = () => {
    if (!activeDoctor || !slot) return;
    const appointment = { doctor: activeDoctor.name, specialization: activeDoctor.specialization, date, slot };
    const current = JSON.parse(localStorage.getItem("appointments") || "[]");
    const alreadyBooked = current.some((item) => item.doctor === appointment.doctor && Number(item.date) === Number(appointment.date) && item.slot === appointment.slot);
    if (alreadyBooked) {
      setNotice("This appointment slot is already booked.");
      return;
    }
    localStorage.setItem("appointments", JSON.stringify([...current, appointment]));
    setNotice(`Appointment requested with ${activeDoctor.name} for ${slot}, Tue ${date}.`);
  };

  return (
    <main className="doctors-page">
      <header className="page-heading">
        <h1>Find a Doctor</h1>
        <p>{doctors.length} doctors available · book an appointment in under a minute</p>
      </header>
      <div className="specialty-filters" aria-label="Filter by specialty">
        {specialties.map((item) => <button key={item} className={specialty === item ? "filter-chip active" : "filter-chip"} onClick={() => { setSpecialty(item); setNotice(""); }}>{item}</button>)}
      </div>
      <div className="booking-layout">
        <section className="doctor-grid" aria-label="Available doctors">
          {visibleDoctors.map((doctor, index) => (
            <article key={doctor._id || doctor.name} className={selected === index ? "doctor-card selected" : "doctor-card"}>
              <div className="doctor-intro">
                <div className="doctor-avatar" style={{ "--avatar-color": colors[index % colors.length] }}>{doctor.photoUrl ? <img src={doctor.photoUrl} alt="" /> : doctor.name.split(" ").filter((part) => !["Dr.", "Dr"].includes(part)).slice(0, 2).map((part) => part[0]).join("").toUpperCase()}</div>
                <div><h2>{doctor.name}</h2><p className="doctor-specialty">{doctor.specialization}</p></div>
              </div>
              <p className="doctor-stats">{doctor.experience} yrs exp <span>★ {doctor.rating || ["4.8", "4.6", "4.9", "4.7"][index % 4]}</span></p>
              <button className={selected === index ? "doctor-action chosen" : "doctor-action"} onClick={() => { setSelected(index); setNotice(""); }}>{selected === index ? "Selected — Booking below" : "Book Appointment"}</button>
            </article>
          ))}
          {!visibleDoctors.length && <p className="empty-state">No doctors found for this specialty.</p>}
        </section>

        <aside className="appointment-panel">
          {activeDoctor ? <>
            <h2>Book Appointment</h2>
            <p className="panel-subtitle">with {activeDoctor.name} · {activeDoctor.specialization}</p>
            <h3 className="field-label">Select date</h3>
            <div className="date-options">{dates.map((item) => <button key={item.date} className={date === item.date ? "date-option active" : "date-option"} onClick={() => { setDate(item.date); setNotice(""); }}><span>{item.day}</span><strong>{item.date}</strong></button>)}</div>
            <div className="slots-heading"><h3 className="field-label slot-label">Available slots</h3><button className="manage-slots-button" onClick={() => setManageSlots(!manageSlots)}>{manageSlots ? "Done" : "Manage slots"}</button></div>
            <div className="slot-options">{doctorSchedule.map((item) => <div className="slot-item" key={item}><button className={slot === item ? "slot-option active" : "slot-option"} onClick={() => { setSlot(item); setNotice(""); }}>{item}</button>{manageSlots && <><button className="slot-edit-button" onClick={() => { setEditingSlot(item); setSlotInput(labelToTime(item)); }}>Edit</button><button className="slot-remove-button" onClick={() => removeSlot(item)}>×</button></>}</div>)}</div>
            {manageSlots && <form className="slot-editor" onSubmit={addOrUpdateSlot}><label htmlFor="slot-time">{editingSlot ? "Edit " + editingSlot : "Add a slot"}</label><div><input id="slot-time" type="time" value={slotInput} onChange={(event) => setSlotInput(event.target.value)} required /><button type="submit">{editingSlot ? "Save" : "Add slot"}</button>{editingSlot && <button type="button" className="cancel-edit" onClick={() => { setEditingSlot(""); setSlotInput(""); }}>Cancel</button>}</div></form>}
            <button className="confirm-button" onClick={confirmBooking}>Confirm Booking — {slot}, {date === 25 ? "Tue" : dates.find((item) => item.date === date)?.day} {date}</button>
            {notice && <p className="booking-notice" role="status">{notice}</p>}
          </> : <p className="empty-state">Choose a doctor to see available appointments.</p>}
        </aside>
      </div>
    </main>
  );
}

export default Doctors;




