import { Routes, Route } from "react-router-dom";
import "./App.css";
import Navbar from "./components/Navbar/Navbar.jsx";
import Footer from "./components/Footer/Footer.jsx";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import Seasons from "./pages/Seasons/Seasons.jsx";
import Home from "./pages/Home/Home.jsx";
import EverySeason from './pages/EverySeason/EverySeason.jsx'
import Register from './pages/Registers/Register.jsx';
import VerifyEmail from './pages/VerifyEmail/VerifyEmail.jsx'; 
import Login from "./pages/Login/Login.jsx";
import ForgotPassword from "./pages/ForgotPassword/ForgotPassword.jsx";
import ResetPassword from "./pages/ResetPassword/ResetPassword.jsx"; 
export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/seasons" element={<Seasons />} />
        <Route path="/seasons/everyseason" element={<EverySeason/>} />
        <Route path="/register" element={<Register/>}/>
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/login" element={<Login/>}/>
        <Route path="/forgot-password" element={<ForgotPassword/>}/>
        <Route path="/reset-password" element={<ResetPassword />} />
      
      </Routes>
      <Footer />
    </>
  );
}
