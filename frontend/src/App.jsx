import { Routes, Route } from "react-router-dom";
import "./index.css";

import Navbar from "./components/Navbar";

import Home from "./pages/Home";
import Homes from "./pages/Homes";
import Experiences from "./pages/Experiences";
import Services from "./pages/Services";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/homes" element={<Homes />} />
        <Route path="/experiences" element={<Experiences />} />
        <Route path="/services" element={<Services />} />
      </Routes>
    </>
  );
}

export default App;
