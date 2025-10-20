import React, { useState, useEffect } from "react";
import { Row, Col, Card, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { api } from "../../api";
import StaffSidebar from "../../components/StaffSidebar";
import StaffNavbar from "../../components/StaffNavbar";
import { Routes, Route } from "react-router-dom"; 
import StaffProfile from "../staff/Profile";
import DoctorsPage from "../staff/Doctor";
import NursesPage from "../staff/Nurse";
import PatientsTableOnly from "../staff/Patient";
import StaffsPage from "../staff/Staff";
import AddBillingForm from "../staff/Billings";
import AddInventoryForm from "../staff/Inventory";

const StaffDashboard = ({ me, onLogout }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [stats, setStats] = useState({
    doctors: 0,
    nurses: 0,
    patients: 0,
    staffs: 0,
  });

  const navigate = useNavigate();
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  // Fetch stats data on page load
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get("/staff/stats");
        setStats(res.data);
      } catch (err) {
        console.error("Failed to load staff stats:", err);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="d-flex">
      {/* Sidebar */}
      {sidebarOpen && <StaffSidebar stats={stats} user={me} />}

      <div className="flex-grow-1">
        {/* Navbar */}
        <StaffNavbar user={me} onLogout={onLogout} onToggleSidebar={toggleSidebar} />

        {/* Main Content */}
        <div className="p-4">
          {/* Routes for different pages */}
          <Routes>
            {/* Default Dashboard Page */}
            <Route
              path="dashboard"
              element={
                <>
                  <h2 className="mb-4">Welcome, {me.name}</h2>

                  {/* Stats Cards */}
                  <Row className="g-4 mb-4">
                    {/* Doctor Card */}
                    <Col md={6} lg={3}>
                      <Card className="shadow text-center border-0 bg-primary text-white">
                        <Card.Body>
                          <h5>Total Doctors</h5>
                          <h2>{stats.doctors}</h2>
                        </Card.Body>
                      </Card>
                    </Col>

                    {/* Nurse Card */}
                    <Col md={6} lg={3}>
                      <Card className="shadow text-center border-0 bg-success text-white">
                        <Card.Body>
                          <h5>Total Nurses</h5>
                          <h2>{stats.nurses}</h2>
                        </Card.Body>
                      </Card>
                    </Col>

                    {/* Patient Card */}
                    <Col md={6} lg={3}>
                      <Card className="shadow text-center border-0 bg-warning text-white">
                        <Card.Body>
                          <h5>Total Patients</h5>
                          <h2>{stats.patients}</h2>
                        </Card.Body>
                      </Card>
                    </Col>

                    {/* Staff Card */}
                    <Col md={6} lg={3}>
                      <Card className="shadow text-center border-0 bg-info text-white">
                        <Card.Body>
                          <h5>Total Staff</h5>
                          <h2>{stats.staffs}</h2>
                        </Card.Body>
                      </Card>
                    </Col>
                  </Row>

                  {/* Action Buttons */}
                  <div className="d-flex justify-content-center mb-4" style={{ gap: "20px" }}>
                    <Button variant="primary" onClick={() => navigate("/staff/patients")}>
                      👨‍⚕️ View Patients
                    </Button>
                    <Button variant="secondary" onClick={() => navigate("/staff/inventory")}>
                      🧑‍⚕️ View Inventory
                    </Button>
                  </div>
                </>
              }
            />

            {/* Staff Profile Route */}
            <Route path="inventory" element={<AddInventoryForm  />} />
            <Route path="billings" element={<AddBillingForm  />} />
            <Route path="staffs" element={<StaffsPage  />} />
            <Route path="patients" element={<PatientsTableOnly  />} />
            <Route path="nurses" element={<NursesPage  />} />
            <Route path="doctors" element={<DoctorsPage  />} />
            <Route path="profile" element={<StaffProfile user={me} />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default StaffDashboard;
