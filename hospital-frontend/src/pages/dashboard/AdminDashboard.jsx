import React, { useEffect, useState } from "react";
import { Row, Col, Card, Button } from "react-bootstrap";
import { Routes, Route, useNavigate } from "react-router-dom";
import { Pie, Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from "chart.js";
import AdminSidebar from "../../components/AdminSidebar";
import AdminNavbar from "../../components/AdminNavbar";
import RegisterModal from "../admin/RegisterModal";
import DoctorsPage from "../admin/Doctors";
import NursesPage from "../admin/Nurses";
import StaffsPage from "../admin/Staffs";
import PatientsPage from "../admin/Patients";
import AppointmentsPage from "../admin/Appointments";
import InventoriesPage from "../admin/Inventories";
import ContactMessages from "../admin/Contacts";
import MedicalHistoriesPage from "../admin/MedicalHistories";
import BillingPage from "../admin/Billing";
import ReportsPage from "../admin/ReportPage";
import AdminProfile from "../admin/Profile";
import NoticeCreate from "../admin/Notice";
import TestNames from "../admin/TestName";
import { api } from "../../api";

// Register chart types
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const AdminDashboard = ({ me, onLogout }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [stats, setStats] = useState({
    doctors: 0,
    nurses: 0,
    staffs: 0,
    patients: 0,
  });
  const [appointmentsData, setAppointmentsData] = useState([]);
  const [billingData, setBillingData] = useState([]);
  const navigate = useNavigate();
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get("/admin/stats");
        setStats(res.data);
      } catch (err) {
        console.error("Failed to load stats:", err);
      }
    };

    const fetchAppointmentData = async () => {
      try {
        const res = await api.get("/admin/appointments-stats");
        setAppointmentsData(res.data);
      } catch (err) {
        console.error("Failed to load appointments data:", err);
      }
    };

    const fetchBillingData = async () => {
      try {
        const res = await api.get("/admin/billing-stats");
        setBillingData(res.data);
      } catch (err) {
        console.error("Failed to load billing data:", err);
      }
    };

    fetchStats();
    fetchAppointmentData();
    fetchBillingData();
  }, []);

  const [modalShow, setModalShow] = useState(false);
  const [modalRole, setModalRole] = useState("doctor");

  const openRegisterModal = (role) => {
    setModalRole(role);
    setModalShow(true);
  };

  // Pie Chart for Appointments Distribution
  const appointmentsChartData = {
    labels: appointmentsData.map((item) => item.status),
    datasets: [
      {
        label: "Appointments",
        data: appointmentsData.map((item) => item.appointments),
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
      },
    ],
  };

  // Bar Chart for Billing Amounts
  const billingChartData = {
    labels: billingData.map((item) => item.month),
    datasets: [
      {
        label: "Billing Amount",
        data: billingData.map((item) => item.amount),
        backgroundColor: "#4e73df",
        borderColor: "#4e73df",
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="d-flex">
      {sidebarOpen && <AdminSidebar adminPhoto={me.photo} adminName={me.name} />}
      <div className="flex-grow-1">
        <AdminNavbar
          user={me}
          onLogout={onLogout}
          onToggleSidebar={toggleSidebar}
        />
        <div className="p-4">
          <Routes>
            {/* Dashboard Default */}
            <Route
              path="dashboard"
              element={
                <>
                  <h2 className="mb-4">Welcome, {me.name}</h2>
                  <Row className="g-4 mb-4">
                    <Col md={6} lg={3}>
                      <Card className="shadow text-center border-0 bg-primary text-white">
                        <Card.Body>
                          <h5>Total Doctors</h5>
                          <h2>{stats.doctors}</h2>
                        </Card.Body>
                      </Card>
                    </Col>

                    <Col md={6} lg={3}>
                      <Card className="shadow text-center border-0 bg-success text-white">
                        <Card.Body>
                          <h5>Total Nurses</h5>
                          <h2>{stats.nurses}</h2>
                        </Card.Body>
                      </Card>
                    </Col>

                    <Col md={6} lg={3}>
                      <Card className="shadow text-center border-0 bg-warning text-white">
                        <Card.Body>
                          <h5>Total Staffs</h5>
                          <h2>{stats.staffs}</h2>
                        </Card.Body>
                      </Card>
                    </Col>

                    <Col md={6} lg={3}>
                      <Card className="shadow text-center border-0 bg-danger text-white">
                        <Card.Body>
                          <h5>Total Patients</h5>
                          <h2>{stats.patients}</h2>
                        </Card.Body>
                      </Card>
                    </Col>
                  </Row>

                  {/* Action Buttons */}
                  <div className="d-flex justify-content-center mb-4" style={{ gap: "20px" }}>
                    <Button variant="primary" onClick={() => openRegisterModal("doctor")}>
                      ➕ Add Doctor
                    </Button>
                    <Button variant="success" onClick={() => openRegisterModal("nurse")}>
                      ➕ Add Nurse
                    </Button>
                    <Button variant="warning" onClick={() => openRegisterModal("staff")}>
                      ➕ Add Staff
                    </Button>
                  </div>

                  {/* Appointment Pie Chart and Billing Bar Chart in the Same Row */}
                  <Row className="mb-4">
                    <Col md={6}>
                      <Card className="shadow">
                        <Card.Body>
                          <h5>Appointments Status</h5>
                          <Pie data={appointmentsChartData} />
                        </Card.Body>
                      </Card>
                    </Col>

                    <Col md={6}>
                      <Card className="shadow">
                        <Card.Body>
                          <h5>Billing Amounts</h5>
                          <Bar data={billingChartData} />
                        </Card.Body>
                      </Card>
                    </Col>
                  </Row>

                  {/* Register Modal */}
                  <RegisterModal
                    show={modalShow}
                    onHide={() => setModalShow(false)}
                    roleDefault={modalRole}
                  />
                </>
              }
            />

            {/* ✅ Nested Routes */}
            <Route path="testnames" element={<TestNames />} />
            <Route path="doctors" element={<DoctorsPage />} />
            <Route path="nurses" element={<NursesPage />} />
            <Route path="staffs" element={<StaffsPage />} />
            <Route path="patients" element={<PatientsPage />} />
            <Route path="appointments" element={<AppointmentsPage />} />
            <Route path="inventory" element={<InventoriesPage />} />
            <Route path="contact" element={<ContactMessages />} />
            <Route path="medical-histories" element={<MedicalHistoriesPage />} />
            <Route path="billings" element={<BillingPage />} />
            <Route path="reports" element={<ReportsPage />} />
            <Route path="notices/create" element={<NoticeCreate />} />
            <Route path="profile" element={<AdminProfile user={me} />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
