import navcss from "./Navbar.module.css";
import oscLogo from "../../assets/images/imgi_1_Lock.png";
import { useState, useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";
import { ThemeContext } from "../../contexts/ThemeContext";
import { ROLES } from "../../utils/constants";

function Navbar() {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useContext(AuthContext);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <nav
      className={`${navcss.navbar} d-flex align-items-center justify-content-between px-4`}
    >
      <div className="d-flex align-items-center">
        <NavLink to={"/"} className={navcss.logos}>
          <div className={navcss.logo}>
            <img src={oscLogo} alt="OSC-Logo" />
          </div>
          <div className={navcss.logop}>
            <h1>OSC</h1>
            <p>MEMORIES</p>
          </div>
        </NavLink>
      </div>

      <button className={navcss.hamburger} onClick={() => setIsOpen(!isOpen)}>
        <span></span>
        <span></span>
        <span></span>
      </button>

      <div className={`${navcss.menuWrapper} ${isOpen ? navcss.showMenu : ""}`}>
        <div className={navcss.navlinks}>
          <NavLink
            to="/"
            className={({ isActive }) => (isActive ? navcss.active : "")}
            onClick={() => setIsOpen(false)}
          >
            Home
          </NavLink>
          <NavLink
            to="/seasons"
            className={({ isActive }) => (isActive ? navcss.active : "")}
            onClick={() => setIsOpen(false)}
          >
            Seasons
          </NavLink>
          <NavLink
            to="/eventinfo"
            className={({ isActive }) => (isActive ? navcss.active : "")}
            onClick={() => setIsOpen(false)}
          >
            Events
          </NavLink>

          {user && (
            <NavLink
              to="/users/me"
              className={({ isActive }) => (isActive ? navcss.active : "")}
              onClick={() => setIsOpen(false)}
            >
              Profile
            </NavLink>
          )}
          {user?.role === ROLES.ADMIN && (
            <NavLink
              to="/members"
              className={({ isActive }) => (isActive ? navcss.active : "")}
              onClick={() => setIsOpen(false)}
            >
              Members
            </NavLink>
          )}
        </div>

        <div className={navcss.menuRight}>
          <button
            onClick={toggleTheme}
            className={navcss.themeToggleSwitch}
            aria-label="Toggle Dark Mode"
          >
            <span className={`${navcss.icon} ${navcss.sunIcon}`}>☀️</span>
            <span className={`${navcss.icon} ${navcss.moonIcon}`}>🌙</span>
            <div className={navcss.toggleCircle}></div>
          </button>

          <div
            className={`${navcss.authLinks} d-flex gap-2 align-items-center`}
          >
            {!user ? (
              <>
                <button
                  onClick={() => {
                    navigate("/login");
                    setIsOpen(false);
                  }}
                >
                  Log In
                </button>
                <button
                  onClick={() => {
                    navigate("/register");
                    setIsOpen(false);
                  }}
                  className={navcss.regbtn}
                >
                  Register
                </button>
              </>
            ) : (
              <button
                onClick={() => {
                  handleLogout();
                  setIsOpen(false);
                }}
              >
                Log Out
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
