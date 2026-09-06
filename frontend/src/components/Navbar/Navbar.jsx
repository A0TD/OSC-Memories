import navcss from "./Navbar.module.css";
import oscLogo from "../../assets/imgi_1_Lock.png";
import { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";

function Navbar() {
  const [theme, setTheme] = useState("light");

  // أول ما الصفحة تفتح، نشوف لو فيه مود مخزن قبل كده
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light";
    setTheme(savedTheme);
    document.documentElement.setAttribute("data-theme", savedTheme);
  }, []);

  // دالة تغيير المود
  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
  };
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
      <button
        onClick={toggleTheme}
        className={navcss.themeToggleSwitch}
        aria-label="Toggle Dark Mode"
      >
        <span className={`${navcss.icon} ${navcss.sunIcon}`}>☀️</span>

        <span className={`${navcss.icon} ${navcss.moonIcon}`}>🌙</span>

        <div className={navcss.toggleCircle}></div>
      </button>
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
