import { Routes, Route } from "react-router-dom";
import "./index.css";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import Homes from "./pages/Homes";
import Experiences from "./pages/Experiences";
import Services from "./pages/Services";
import NotFound from "./pages/NotFound";
import Show from "./pages/Show";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/homes" element={<Homes />} />
        <Route path="/experiences" element={<Experiences />} />
        <Route path="/services" element={<Services />} />
        <Route path="/*" element={<NotFound />} />
        <Route path="/listings/:id" element={<Show />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
