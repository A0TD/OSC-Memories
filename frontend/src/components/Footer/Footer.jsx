import { NavLink } from "react-router-dom";
import footcss from "./Footer.module.css";
import oscLogo from "../../assets/imgi_1_Lock.png";
import linkedin from "../../assets/linkedin.png";
import facebook from "../../assets/icons8-facebook-48.png";
import instagram from "../../assets/icons8-instagram-48.png";
function Footer() {
  return (
    <footer>
      <div className={`${footcss.footerContent} container-fluid`}>
        <div className="row g-4">
          <div className={`${footcss.footerBrand} col-12 col-md-6 col-lg-5  `}>
            <div className="d-flex">
              <div>
                <img src={oscLogo} alt="OSC-Logo" />
              </div>
              <h3>
                OSC <span>MEMORIES</span>
              </h3>
            </div>
            <p>Relive the moments, celebrate the journey together.</p>
          </div>
          <div className="d-flex flex-column col-4 col-md-3 col-lg-2  ">
            <h3>Account</h3>
            <NavLink to="/">Login</NavLink>

            <NavLink to="/register">Register</NavLink>
          </div>
          <div className="d-flex flex-column  col-4 col-md-3 col-lg-2  ">
            <h3>Quick Links</h3>
            <NavLink to="/">Home</NavLink>

            <NavLink to="/home">Seasons</NavLink>

            <NavLink to="/home">Events</NavLink>
          </div>
          <div className=" col-4 col-md-12 col-lg-3 ">
            <h3>Follow Us</h3>
            <div className="d-flex gap-3 ">
              <a
                href="https://www.facebook.com/share/1DjbiuiTob/"
                target="_blank"
                rel="facebook-icon"
              >
                <img src={facebook} alt="facebook-icon" />
              </a>
              <a
                href="https://www.linkedin.com/company/osc---open-source-community/"
                target="_blank"
                rel="linkedin-icon"
              >
                <img src={linkedin} />
              </a>
              <a
                href="https://www.instagram.com/oscgeeks?stkn=NDlxMjNtbGIwcTh2"
                target="_blank"
                rel="instegram-icon"
              >
                <img src={instagram} alt="instegram-icon" />
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
