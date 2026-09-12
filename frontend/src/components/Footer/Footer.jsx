import React, { useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import footcss from "./Footer.module.css";
import { AuthContext } from "../../contexts/AuthContext";
import oscLogo from "../../assets/images/imgi_1_Lock.png";
import linkedin from "../../assets/images/linkedin.png";
import facebook from "../../assets/images/icons8-facebook-48.png";
import instagram from "../../assets/images/icons8-instagram-48.png";

function Footer() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <footer>
      <div className={`${footcss.footerContent} container-fluid`}>
        <div className="row g-4">
          <div className={`${footcss.footerBrand} col-12 col-md-6 col-lg-5`}>
            <div className="d-flex align-items-center gap-2">
              <div>
                <img src={oscLogo} alt="OSC-Logo" />
              </div>
              <h3>
                OSC <span>MEMORIES</span>
              </h3>
            </div>
            <p>Relive the moments, celebrate the journey together.</p>
          </div>

          <div className="d-flex flex-column col-6 col-md-3 col-lg-2">
            <h3>Account</h3>
            {!user ? (
              <>
                <NavLink to="/login">Login</NavLink>
                <NavLink to="/register">Register</NavLink>
              </>
            ) : (
              <>
                <NavLink to="/users/me">Profile</NavLink>
                <span
                  onClick={handleLogout}
                  style={{ cursor: "pointer" }}
                  className={footcss.logout}
                >
                  Logout
                </span>
              </>
            )}
          </div>

          <div className="d-flex flex-column col-6 col-md-3 col-lg-2">
            <h3>Quick Links</h3>
            <NavLink to="/">Home</NavLink>
            <NavLink to="/seasons">Seasons</NavLink>
            <NavLink to="/eventinfo">Events</NavLink>
          </div>

          <div className="col-12 col-md-12 col-lg-3">
            <h3>Follow Us</h3>
            <div className="d-flex gap-3">
              <a
                href="https://www.facebook.com/share/1DjbiuiTob/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img src={facebook} alt="facebook-icon" />
              </a>
              <a
                href="https://www.linkedin.com/company/osc---open-source-community/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img src={linkedin} alt="linkedin-icon" />
              </a>
              <a
                href="https://www.instagram.com/oscgeeks?stkn=NDlxMjNtbGIwcTh2"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img src={instagram} alt="instagram-icon" />
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className={footcss.footerBottom}>
        <p>&copy; 2026 OSC Memories. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;
