import navcss from "./Navbar.module.css";
import oscLogo from "../../assets/imgi_1_Lock.png";
import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const [user, setUser] = useState(null);

  const handleLogout = () => {
    setUser(null);
    navigate("/");
  };

  return (
    <nav
      className={`${navcss.navbar} d-flex align-items-center justify-content-between`}
    >

      <div className="d-flex align-items-center">
        <div className={navcss.logo}>
          <img src={oscLogo} alt="OSC-Logo" />
        </div>
        <div className={navcss.logop}>
          <h1>osc</h1>
          <p>MEMORIES</p>
        </div>
      </div>

      <button className={navcss.hamburger} onClick={() => setIsOpen(!isOpen)}>
        <span></span>
        <span></span>
        <span></span>
      </button>

      <div
        className={`${navcss.navlinks} gap-sm-3 gap-md-4 gap-lg-5 ${isOpen ? navcss.showMenu : ""}`}
      >
        <NavLink
          to="/"
          className={({ isActive }) => (isActive ? navcss.active : "")}
        >
          Home
        </NavLink>

        <NavLink
          to="/seasons"
          className={({ isActive }) => (isActive ? navcss.active : "")}
        >
          Seasons
        </NavLink>

        <NavLink
          to="/events"
          className={({ isActive }) => (isActive ? navcss.active : "")}
        >
          Events
        </NavLink>

        {user && (
          <NavLink
            to="/profile"
            className={({ isActive }) => (isActive ? navcss.active : "")}
          >
            Profile
          </NavLink>
        )}
        {user?.role === "admin" && (
          <NavLink
            to="/members"
            className={({ isActive }) => (isActive ? navcss.active : "")}
          >
            Members
          </NavLink>
        )}
      </div>
      <div className={`${navcss.authLinks} d-flex gap-4`}>
        {!user ? (
          <>
            <button onClick={() => navigate("/login")}>Log In</button>
            <button
              onClick={() => navigate("/register")}
              className={navcss.regbtn}
            >
              Register
            </button>
          </>
        ) : (
          <button onClick={handleLogout}>Log Out</button>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
