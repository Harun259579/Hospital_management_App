import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { api } from "./api";

import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import AdminDashboard from "./pages/dashboard/AdminDashboard";
import DoctorDashboard from "./pages/dashboard/DoctorDashboard";
import NurseDashboard from "./pages/dashboard/NurseDashboard";
import StaffDashboard from "./pages/dashboard/StaffDashboard";
import PatientDashboard from "./pages/dashboard/PatientDashboard";
import Home from "./pages/Home";
import AboutUs from "./pages/AboutUs";
import Contact from "./pages/Contact";
import Doctors from "./pages/Doctors"
import Footer from "./components/Footer";
import AppNavbar from "./components/Navbar";

function App() {
  const [me, setMe] = useState(null);
  const nav = useNavigate();

  useEffect(() => {
    const t = localStorage.getItem("token");
    if (t) {
      api
        .get("/me", { headers: { Authorization: `Bearer ${t}` } })
        .then((res) => setMe(res.data))
        .catch(() => setMe(null));
    }
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    setMe(null);
    nav("/login");
  };

  return (
    <>
      
      {((!me || me.role !== "admin") && (!me || me.role !== "doctor") && (!me || me.role !== "nurse")  && (!me || me.role !== "staff") && (!me || me.role !== "patient")) && <AppNavbar user={me} onLogout={logout} />}



      <Routes>
        <Route path="/" element={<Home user={me} onLogout={logout} />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/contact" element={<Contact />} />
        
        <Route path="/doctors" element={<Doctors />} />

        {/* Auth */}
        <Route path="/login" element={<Login onLogin={setMe} />} />
        <Route path="/register" element={<Register onRegister={setMe} />} />

        {/* Admin Dashboard (Protected) */}
        <Route
          path="/admin/*"
          element={
            me && me.role === "admin" ? (
              <AdminDashboard me={me} onLogout={logout} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />


        {/* Doctor Dashboard (Protected) */}
        <Route
          path="/doctor/*"
          element={
            me && me.role === "doctor" ? (
              <DoctorDashboard me={me} onLogout={logout} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
         {/* Nurse Dashboard (Protected) */}
        <Route
          path="/nurse/*"
          element={
            me && me.role === "nurse" ? (
              <NurseDashboard me={me} onLogout={logout} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />

         {/* Staff Dashboard (Protected) */}
        <Route
          path="/staff/*"
          element={
            me && me.role === "staff" ? (
              <StaffDashboard me={me} onLogout={logout} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />

           {/* Patient Dashboard (Protected) */}
        <Route
          path="/patient/*"
          element={
            me && me.role === "patient" ? (
              <PatientDashboard me={me} onLogout={logout} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />


        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
