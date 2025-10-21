import React, { useState, useEffect } from "react";
import { Form, Button, Container, Row, Col, Alert } from "react-bootstrap";
import { api } from "../../api"; // your axios instance with auth

const Appointments = () => {
  const [doctors, setDoctors] = useState([]);
  const [formData, setFormData] = useState({
    doctor_id: "",
    date: "",
    time: "",
  });
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

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

  // ✅ Handle form input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // ✅ Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    setError(null);

    try {
      const res = await api.post("/appointments", formData);
      setMessage("Appointment booked successfully!");
      setFormData({ doctor_id: "", date: "", time: "" });
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.message || "Failed to book appointment.";
      setError(msg);
    }
  };

  return (
    <Container className="py-5">
      <h3 className="mb-4 text-primary">Book an Appointment</h3>

      {message && <Alert variant="success">{message}</Alert>}
      {error && <Alert variant="danger">{error}</Alert>}

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
    </Container>
  );
};

export default Appointments;
