import React, { useState, useEffect } from "react";
import { Row, Col, Card, Button } from "react-bootstrap";
import { useNavigate, Routes, Route } from "react-router-dom";
import { api } from "../../api";
import NurseSidebar from "../../components/NurseSidebar";
import NurseNavbar from "../../components/NurseNavbar";

// Import nested nurse routes
import NurseProfile from "../nurse/Profile";
import DoctorsPage from "../nurse/Doctor";
import NursesPage from "../nurse/Nurse";
import PatientsTableOnly from "../nurse/Patient";
/*

import AddBillingForm from "../nurse/Billings";
import AddInventoryForm from "../nurse/Inventory";*/

const NurseDashboard = ({ me, onLogout }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [stats, setStats] = useState({
    doctors: 0,
    nurses: 0,
    patients: 0,
  });

  const navigate = useNavigate();
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get("/nurse/stats");
        setStats(res.data);
      } catch (err) {
        console.error("Failed to load nurse stats:", err);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="d-flex">
      {/* Sidebar */}
      {sidebarOpen && <NurseSidebar user={me} />}

      <div className="flex-grow-1">
        {/* Navbar */}
        <NurseNavbar user={me} onLogout={onLogout} onToggleSidebar={toggleSidebar} />

        {/* Main Content */}
        <div className="p-4">
          <Routes>
            {/* Dashboard Home */}
            <Route
              path="dashboard"
              element={
                <>
                  <h2 className="mb-4">Welcome, {me.name}</h2>

                  {/* === STATS CARDS === */}
                  <Row className="g-4 mb-4">
                    {/* Doctor Card */}
                    <Col md={6} lg={4}>
                      <Card className="shadow text-center border-0 bg-primary text-white">
                        <Card.Body>
                          <h5>Total Doctors</h5>
                          <h2>{stats.doctors}</h2>
                        </Card.Body>
                      </Card>
                    </Col>

                    {/* Nurse Card */}
                    <Col md={6} lg={4}>
                      <Card className="shadow text-center border-0 bg-success text-white">
                        <Card.Body>
                          <h5>Total Nurses</h5>
                          <h2>{stats.nurses}</h2>
                        </Card.Body>
                      </Card>
                    </Col>

                    {/* Patient Card */}
                    <Col md={6} lg={4}>
                      <Card className="shadow text-center border-0 bg-warning text-white">
                        <Card.Body>
                          <h5>Total Patients</h5>
                          <h2>{stats.patients}</h2>
                        </Card.Body>
                      </Card>
                    </Col>
                  </Row>

                  {/* === Quick Actions === */}
                  <div className="d-flex justify-content-center mb-4" style={{ gap: "20px" }}>
                    <Button variant="primary" onClick={() => navigate("/nurse/doctors")}>
                      👨‍⚕️ View Doctors
                    </Button>
                    <Button variant="success" onClick={() => navigate("/nurse/nurses")}>
                      🧑‍ View Nurses
                    </Button>
                    <Button variant="warning" onClick={() => navigate("/nurse/patients")}>
                      👩‍⚕️ View Patients
                    </Button>
                    
                  </div>
                </>
              }
            />

            {/* Nested Routes */}
          {/*<Route path="billings" element={<AddBillingForm />} />
            <Route path="inventory" element={<AddInventoryForm />} />
            
            
            */}
            <Route path="patients" element={<PatientsTableOnly />} />
            <Route path="nurses" element={<NursesPage />} />
            <Route path="doctors" element={<DoctorsPage />} />
            <Route path="profile" element={<NurseProfile user={me} />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default NurseDashboard;
