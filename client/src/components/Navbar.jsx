import { Link, NavLink } from "react-router-dom";

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/doctors" className="logo">
          <span className="logo-mark" aria-hidden="true">
          
          </span>
          MediBook
        </Link>

        <div className="nav-links">
          <NavLink to="/doctors">Find Doctors</NavLink>
          <NavLink to="/appointments">My Appointments</NavLink>
        </div>

        <div className="profile">
          <span className="profile-avatar">PM</span>
          <span>Padmashree</span>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;

