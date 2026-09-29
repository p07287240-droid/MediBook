import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Doctors from "./pages/Doctors";

function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        <Route path="/" element={<Navigate to="/doctors" replace />} />
        <Route path="/doctors" element={<Doctors />} />
        <Route path="/appointments" element={<Appointments />} />
      </Routes>
    </BrowserRouter>
  );
}

function Appointments() {
  const appointments = JSON.parse(
    localStorage.getItem("appointments") || "[]",
  );

  return (
    <main className="doctors-page">
      <header className="page-heading">
        <h1>My Appointments</h1>
        <p>Your upcoming visits</p>
      </header>

      {appointments.length ? (
        <div className="saved-appointments">
          {appointments.map((item, index) => (
            <article className="appointment-panel" key={index}>
              <h2>{item.doctor}</h2>
              <p>
                {item.specialization}  {item.slot}  {item.date}
              </p>
            </article>
          ))}
        </div>
      ) : (
        <div className="appointment-panel empty-appointments">
          No appointments yet. Find a doctor to book your first visit.
        </div>
      )}
    </main>
  );
}

export default App;

