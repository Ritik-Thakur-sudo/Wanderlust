import { Routes, Route, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import "./index.css";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import Homes from "./pages/Homes";
import Experiences from "./pages/Experiences";
import Services from "./pages/Services";
import NotFound from "./pages/NotFound";
import Show from "./pages/Show";
import Edit from "./pages/Edit";
import Create from "./pages/Create";

import ProtectedRoute from "./components/ProtectedRoute";
import LoginModal from "./components/LoginModal"; 
import api from "./axiosConfig";

function App() {
  const location = useLocation();
  const state = location.state || null;

  useEffect(() => {
    api.get("/session-test").catch(console.error);
  }, []);

  return (
    <>
      <Navbar />
      <Routes location={state?.background || location}>
        <Route path="/" element={<Home />} />
        <Route path="/homes" element={<Homes />} />
        <Route path="/experiences" element={<Experiences />} />
        <Route path="/services" element={<Services />} />
        <Route path="/listings/:id" element={<Show />} />

        <Route
          path="/listings/create"
          element={
            <ProtectedRoute>
              <Create />
            </ProtectedRoute>
          }
        />
        <Route
          path="/listings/:id/edit"
          element={
            <ProtectedRoute>
              <Edit />
            </ProtectedRoute>
          }
        />
        <Route path="/*" element={<NotFound />} />
      </Routes>

      {state?.background && (
        <Routes>
          <Route path="/login" element={<LoginModal open />} />
          <Route path="/signup" element={<LoginModal open />} />
        </Routes>
      )}

      <Footer />
    </>
  );
}

export default App;
