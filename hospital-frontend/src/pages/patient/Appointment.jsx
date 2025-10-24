import React, { useState, useEffect } from "react";
import { Form, Button, Container, Row, Col, Alert, Table } from "react-bootstrap";
import { api } from "../../api"; 
import { FaDownload } from "react-icons/fa";

const Appointments = () => {
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [formData, setFormData] = useState({
    doctor_id: "",
    date: "",
    time: "",
  });
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // ✅ Fetch doctor list
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const res = await api.get("/doctors");
        setDoctors(res.data.data || []);
      } catch (err) {
        console.error(err);
        setError("Failed to load doctors.");
      }
    };
    fetchDoctors();
  }, []);

  // ✅ Fetch patient’s own appointments
  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const res = await api.get("/appointments");
      const data = Array.isArray(res.data) ? res.data : res.data.data || [];
      setAppointments(data);
    } catch (err) {
      console.error("Failed to fetch appointments:", err);
      setError("Failed to load appointments.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  // ✅ Handle form input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    setError(null);

    try {
      await api.post("/appointments", formData);
      setMessage("Appointment booked successfully!");
      setFormData({ doctor_id: "", date: "", time: "" });
      fetchAppointments(); // 🔄 Refresh appointments list
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.message || "Failed to book appointment.";
      setError(msg);
    }
  };

  // ✅ Handle download
  const handleDownload = (appt) => {
    const doctorName = appt.doctor?.user?.name || "N/A";
    const patientName = appt.patient?.user?.name || "You";
    const token = appt.token_id || "N/A";

    const content = `
🩺 Appointment Details
----------------------------
Patient: ${patientName}
Doctor: ${doctorName}
Date: ${appt.date}
Time: ${appt.time}
Status: ${appt.status}
Token: ${token}
----------------------------
Thank you for booking with our hospital.
    `;

    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Appointment-${doctorName}-${appt.date}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Container className="py-5">
      <h3 className="mb-4 text-primary">Book an Appointment</h3>

      {message && <Alert variant="success">{message}</Alert>}
      {error && <Alert variant="danger">{error}</Alert>}

      {/* ---------------- Appointment Form ---------------- */}
      <Form onSubmit={handleSubmit}>
        <Row className="mb-3">
          <Col md={6}>
            <Form.Group>
              <Form.Label>Select Doctor</Form.Label>
              <Form.Select
                name="doctor_id"
                value={formData.doctor_id}
                onChange={handleChange}
                required
              >
                <option value="">-- Choose Doctor --</option>
                {doctors.map((doc) => (
                  <option key={doc.id} value={doc.id}>
                    {doc.user?.name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>

          <Col md={3}>
            <Form.Group>
              <Form.Label>Date</Form.Label>
              <Form.Control
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </Col>

          <Col md={3}>
            <Form.Group>
              <Form.Label>Time</Form.Label>
              <Form.Control
                type="time"
                name="time"
                value={formData.time}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </Col>
        </Row>

        <Button type="submit" variant="primary">
          Book Appointment
        </Button>
      </Form>

      {/* ---------------- My Appointments Table ---------------- */}
      <hr className="my-5" />
      <h4 className="text-success mb-3">My Appointments</h4>

      {loading ? (
        <p>Loading appointments...</p>
      ) : appointments.length === 0 ? (
        <p>No appointments found.</p>
      ) : (
        <Table bordered hover responsive>
          <thead className="table-primary">
            <tr>
              <th>Doctor Name</th>
              <th>Date</th>
              <th>Time</th>
              <th>Status</th>
              <th>Token</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((appt) => (
              <tr key={appt.id}>
                <td>{appt.doctor?.user?.name || "N/A"}</td>
                <td>{appt.date}</td>
                <td>{appt.time}</td>
                <td>
                  <span
                    className={`badge bg-${
                      appt.status === "approved"
                        ? "success"
                        : appt.status === "pending"
                        ? "warning"
                        : "danger"
                    }`}
                  >
                    {appt.status}
                  </span>
                </td>
                <td>
                  {appt.token_id ? (
                    <code>{appt.token_id}</code>
                  ) : (
                    <span className="text-muted">N/A</span>
                  )}
                </td>
                <td>
                  {/* ✅ Only show Download button when approved and has token */}
                  {appt.status === "approved" && appt.token_id && (
                    <Button
                      variant="info"
                      size="sm"
                      onClick={() => handleDownload(appt)}
                    >
                      <FaDownload className="me-1" />
                     
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Container>
  );
};

export default Appointments;
