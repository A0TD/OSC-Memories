import navcss from "./Navbar.module.css";
import oscLogo from "../../assets/images/imgi_1_Lock.png";
import { useState, useContext, useEffect } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";
import { ThemeContext } from "../../contexts/ThemeContext";

function Navbar() {
  const { toggleTheme } = useContext(ThemeContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useContext(AuthContext);

  // Close menu automatically on route change
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <>
      <nav
        className={`${navcss.navbar} d-flex align-items-center justify-content-between px-4`}
      >
        <div className="d-flex align-items-center">
          <NavLink to="/" className={navcss.logos}>
            <div className={navcss.logo}>
              <img src={oscLogo} alt="" aria-hidden="true" />
            </div>
            <div className={navcss.logop}>
              <h1>OSC</h1>
              <p>MEMORIES</p>
            </div>
          </NavLink>
        </div>

        {/* Mobile top-bar controls (Theme toggle + Hamburger) */}
        <div className={navcss.mobileNavControls}>
          <button
            onClick={toggleTheme}
            className={navcss.themeToggleSwitch}
            aria-label="Toggle Dark Mode"
          >
            <span className={`${navcss.icon} ${navcss.sunIcon}`}>☀️</span>
            <span className={`${navcss.icon} ${navcss.moonIcon}`}>🌙</span>
            <div className={navcss.toggleCircle}></div>
          </button>

          <button
            className={`${navcss.hamburger} ${isOpen ? navcss.open : ""}`}
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle navigation menu"
            aria-expanded={isOpen}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>

        <div
          className={`${navcss.menuWrapper} ${isOpen ? navcss.showMenu : ""}`}
        >
          <div className={navcss.navlinks}>
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
              to="/eventinfo"
              className={({ isActive }) => (isActive ? navcss.active : "")}
            >
              Events
            </NavLink>

            {user && (
              <NavLink
                to="/users/me"
                className={({ isActive }) => (isActive ? navcss.active : "")}
              >
                Profile
              </NavLink>
            )}
            {user?.role === "Admin" && (
              <NavLink
                to="/members"
                className={({ isActive }) => (isActive ? navcss.active : "")}
              >
                Members
              </NavLink>
            )}
          </div>

          <div className={navcss.menuRight}>
            {/* Desktop Theme Toggle */}
            <button
              onClick={toggleTheme}
              className={`${navcss.themeToggleSwitch} ${navcss.desktopThemeToggle}`}
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
          </div>
        </div>
      </nav>

      {/* Backdrop overlay for mobile drawer */}
      <div
        className={`${navcss.menuBackdrop} ${isOpen ? navcss.showBackdrop : ""}`}
        onClick={() => setIsOpen(false)}
      />
    </>
  );
}

export default Navbar;
