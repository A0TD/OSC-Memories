import { Routes, Route } from "react-router-dom";
import "./App.css";
import Navbar from "./components/Navbar/Navbar.jsx";
import Footer from "./components/Footer/Footer.jsx";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import Seasons from "./pages/Seasons/Seasons.jsx";
import Home from "./pages/Home/Home.jsx";
import Events from "./pages/Events/Events.jsx";
import EventInfo from "./pages/EventInfo/EventInfo.jsx";
import Register from "./pages/Registers/Register.jsx";
import VerifyEmail from "./pages/VerifyEmail/VerifyEmail.jsx";
import Login from "./pages/Login/Login.jsx";
import ForgotPassword from "./pages/ForgotPassword/ForgotPassword.jsx";
import ResetPassword from "./pages/ResetPassword/ResetPassword.jsx";
import NotFound from "./pages/NotFound/NotFound.jsx";
import Members from "./pages/Members/Members.jsx";
import Media from "./pages/Media/Media.jsx";
import Profile from "./pages/Profile/Profile.jsx";
export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/seasons" element={<Seasons />} />
        <Route path="/seasons/:id/events" element={<Events />} />
        <Route
          path="/seasons/:seasonId/events/:eventId/media"
          element={<Media />}
        />{" "}
        <Route path="/users/me" element={<Profile />} />
        <Route path="/eventinfo" element={<EventInfo />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/members" element={<Members />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
    </>
  );
}
