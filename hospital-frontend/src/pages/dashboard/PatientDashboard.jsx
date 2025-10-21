import React, { useEffect, useState } from "react";
import { Row, Col, Card, Button } from "react-bootstrap";
import { Routes, Route, useNavigate } from "react-router-dom";

import PatientSidebar from "../../components/PatientSidebar";
import PatientNavbar from "../../components/PatientNavbar";
import PatientProfile from "../patient/Profile";
import DoctorsPage from "../patient/Doctor";
import PatientBillingPage from"../patient/Billing";
import Appointments from"../patient/Appointment";
/*
import AppointmentsPage from "../patient/Appointments";
import MedicalHistoryPage from "../patient/MedicalHistory";

*/
import { api } from "../../api";

const PatientDashboard = ({ me, onLogout }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [stats, setStats] = useState({
    doctors: 0,
    appointments: 0,
    histories: 0,
  });

  const navigate = useNavigate();
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await api.get("/patient/stats", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setStats(res.data);
      } catch (err) {
        console.error("Failed to load patient stats:", err);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="d-flex">
      {/* Sidebar */}
      {sidebarOpen && <PatientSidebar user={me} />}

      {/* Main Content */}
      <div className="flex-grow-1">
        <PatientNavbar
          user={me}
          onLogout={onLogout}
          onToggleSidebar={toggleSidebar}
        />

        <div className="p-4">
          <Routes>
            {/* Default Dashboard Page */}
            <Route
              path="dashboard"
              element={
                <>
                  <h2 className="mb-4">Welcome, {me.name}</h2>

                  {/* Stats Cards */}
                  <Row className="g-4 mb-4">
                    <Col md={6} lg={4}>
                      <Card className="shadow text-center border-0 bg-primary text-white">
                        <Card.Body>
                          <h5>Total Doctors</h5>
                          <h2>{stats.doctors}</h2>
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
                      <Card className="shadow text-center border-0 bg-info text-white">
                        <Card.Body>
                          <h5>Medical History</h5>
                          <h2>{stats.histories}</h2>
                        </Card.Body>
                      </Card>
                    </Col>
                  </Row>

                  {/* Navigation Buttons */}
                  <div
                    className="d-flex justify-content-center mb-4"
                    style={{ gap: "20px" }}
                  >
                    <Button
                      variant="primary"
                      onClick={() => navigate("/patient/doctors")}
                    >
                      👨‍⚕️ View Doctors
                    </Button>
                    <Button
                      variant="success"
                      onClick={() => navigate("/patient/appointments")}
                    >
                      📅 View Appointments
                    </Button>
                    <Button
                      variant="info"
                      onClick={() => navigate("/patient/medical-histories")}
                    >
                      🩺 View Medical History
                    </Button>
                  </div>
                </>
              }
            />

            {/* Nested Routes */}
            <Route path="/appointments" element={<Appointments />} />
            <Route path="profile" element={<PatientProfile user={me} />} />
            <Route path="doctors" element={<DoctorsPage />} />
            <Route path="billings" element={<PatientBillingPage />} />
            {/*
            <Route path="appointments" element={<AppointmentsPage />} />
            <Route path="medical-history" element={<MedicalHistoryPage />} />
            */}
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;
