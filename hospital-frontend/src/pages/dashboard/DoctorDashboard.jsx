import React, { useEffect, useState } from "react";
import { Row, Col, Card, Button } from "react-bootstrap";
import { Routes, Route, useNavigate } from "react-router-dom";

import DoctorSidebar from "../../components/DoctorSidebar";
import DoctorNavbar from "../../components/DoctorNavbar";
import PatientsTableOnly from "../doctor/Patient";
import NursesPage from "../doctor/Nurse";
import DoctorsPage from "../doctor/doctor";
import DoctorProfile from "../doctor/Profile";

import { api } from "../../api";

const DoctorDashboard = ({ me, onLogout }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [stats, setStats] = useState({
    patients: 0,
    appointments: 0,
    histories: 0,
  });

  const navigate = useNavigate();
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get("/doctor/stats");
        setStats(res.data);
      } catch (err) {
        console.error("Failed to load doctor stats:", err);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="d-flex">
      {sidebarOpen && <DoctorSidebar doctorPhoto={me.photo} doctorName={me.name} />}
      <div className="flex-grow-1">
        <DoctorNavbar user={me} onLogout={onLogout} onToggleSidebar={toggleSidebar} />

        <div className="p-4">
          <Routes>
            {/* Default Dashboard Page */}
            <Route
              path="dashboard"
              element={
                <>
                  <h2 className="mb-4">Welcome,  {me.name}</h2>

                  {/* Stats Cards */}
                  <Row className="g-4 mb-4">
                    <Col md={6} lg={4}>
                      <Card className="shadow text-center border-0 bg-primary text-white">
                        <Card.Body>
                          <h5>Total Patients</h5>
                          <h2>{stats.patients}</h2>
                        </Card.Body>
                      </Card>
                    </Col>

                    <Col md={6} lg={4}>
                      <Card className="shadow text-center border-0 bg-success text-white">
                        <Card.Body>
                          <h5>Total Appointments</h5>
                          <h2>{stats.appointments}</h2>
                        </Card.Body>
                      </Card>
                    </Col>

                    <Col md={6} lg={4}>
                      <Card className="shadow text-center border-0 bg-warning text-white">
                        <Card.Body>
                          <h5>Medical Histories</h5>
                          <h2>{stats.histories}</h2>
                        </Card.Body>
                      </Card>
                    </Col>
                  </Row>

                  {/* Example Action Buttons */}
                  <div
                    className="d-flex justify-content-center mb-4"
                    style={{ gap: "20px" }}
                  >
                    <Button
                      variant="primary"
                      onClick={() => navigate("/doctor/appointments")}
                    >
                      📅 View Appointments
                    </Button>
                    <Button
                      variant="success"
                      onClick={() => navigate("/doctor/patients")}
                    >
                      👨‍⚕️ View Patients
                    </Button>
                  </div>
                </>
              }
            />

            {/* Nested Routes */}
            <Route path="doctors" element={<DoctorsPage />} />
            <Route path="nurses" element={<NursesPage />} />
            <Route path="patients" element={<PatientsTableOnly />} />
            <Route path="profile" element={<DoctorProfile user={me} />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;
