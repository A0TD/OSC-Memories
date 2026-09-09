import { Routes, Route } from "react-router-dom";
import "./App.css";
import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import Seasons from "./pages/Seasons/Seasons.jsx";
import Home from "./pages/Home/Home";
import EverySeason from './pages/EverySeason/EverySeason.jsx'
import Register from './pages/Registers/Register.jsx';
export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/seasons" element={<Seasons />} />
        <Route path="/seasons/everyseason" element={<EverySeason/>} />
        <Route path="/register" element={<Register/>}/>
      </Routes>
      <Footer />
    </>
  );
}
