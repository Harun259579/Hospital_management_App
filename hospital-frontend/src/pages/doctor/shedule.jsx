import React, { useEffect, useState } from "react";
import { Row, Col, Button, Form, Table, Modal } from "react-bootstrap";
import { api } from "../../api";

const DoctorSchedule = () => {
  const [schedules, setSchedules] = useState([]);
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    day_of_week: "",
    start_time: "",
    end_time: "",
  });

  const [doctorId, setDoctorId] = useState(null);

  // ✅ Fetch logged-in doctor info
  useEffect(() => {
    const fetchDoctorInfo = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await api.get("/doctor/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setDoctorId(res.data.id);
      } catch (error) {
        console.error("Failed to fetch doctor info:", error);
      }
    };
    fetchDoctorInfo();
  }, []);

  // ✅ Fetch doctor schedules
  const fetchSchedules = async () => {
    if (!doctorId) return;
    try {
      const res = await api.get(`/doctor-shedules?doctor_id=${doctorId}`);
      setSchedules(res.data);
    } catch (err) {
      console.error("Failed to load schedules:", err);
    }
  };

  useEffect(() => {
    fetchSchedules();
  }, [doctorId]);

  // ✅ Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ Save or update schedule
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!doctorId) return alert("Doctor ID not found!");

    const data = { doctor_id: doctorId, ...formData };

    try {
      if (selectedSchedule) {
        await api.put(`/doctor-shedules/${selectedSchedule.id}`, data);
      } else {
        await api.post("/doctor-shedules", data);
      }

      setFormData({ day_of_week: "", start_time: "", end_time: "" });
      setSelectedSchedule(null);
      setShowModal(false);
      fetchSchedules();
    } catch (err) {
      console.error("Error saving schedule:", err);
    }
  };

  // ✅ Edit button click → open modal
  const handleEdit = (schedule) => {
    setSelectedSchedule(schedule);
    setFormData({
      day_of_week: schedule.day_of_week,
      start_time: schedule.start_time,
      end_time: schedule.end_time,
    });
    setShowModal(true);
  };

  // ✅ Delete schedule
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this schedule?")) return;

    try {
      await api.delete(`/doctor-shedules/${id}`);
      fetchSchedules();
    } catch (err) {
      console.error("Failed to delete schedule:", err);
    }
  };

  return (
    <>
      <h2 className="text-center text-primary mb-4">Doctor Schedule</h2>

      {/* Add New Schedule */}
      <Form
        onSubmit={handleSubmit}
        className="p-4 shadow-sm rounded bg-light mb-5"
      >
        <Row className="g-3">
          <Col md={6}>
            <Form.Group>
              <Form.Label>Doctor ID</Form.Label>
              <Form.Control
                type="text"
                value={doctorId || ""}
                readOnly
                placeholder="Loading doctor ID..."
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group>
              <Form.Label>Day of Week</Form.Label>
              <Form.Control
                type="text"
                name="day_of_week"
                value={formData.day_of_week}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group>
              <Form.Label>Start Time</Form.Label>
              <Form.Control
                type="time"
                name="start_time"
                value={formData.start_time}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group>
              <Form.Label>End Time</Form.Label>
              <Form.Control
                type="time"
                name="end_time"
                value={formData.end_time}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </Col>
        </Row>

        <div className="text-center mt-4">
          <Button type="submit" variant="primary">
            Save Schedule
          </Button>
        </div>
      </Form>

      {/* Schedule Table */}
      <Row>
        <Col>
          <Table bordered hover responsive className="text-center align-middle">
            <thead className="table-primary">
              <tr>
                <th>Day</th>
                <th>Start Time</th>
                <th>End Time</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {schedules.length > 0 ? (
                schedules.map((schedule) => (
                  <tr key={schedule.id}>
                    <td>{schedule.day_of_week}</td>
                    <td>{schedule.start_time}</td>
                    <td>{schedule.end_time}</td>
                    <td>
                      <Button
                        variant="warning"
                        size="sm"
                        onClick={() => handleEdit(schedule)}
                      >
                        Edit
                      </Button>{" "}
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleDelete(schedule.id)}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-muted">
                    No schedules available
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </Col>
      </Row>

      {/* ✅ Edit Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Schedule</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Day of Week</Form.Label>
              <Form.Control
                type="text"
                name="day_of_week"
                value={formData.day_of_week}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Start Time</Form.Label>
                  <Form.Control
                    type="time"
                    name="start_time"
                    value={formData.start_time}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>End Time</Form.Label>
                  <Form.Control
                    type="time"
                    name="end_time"
                    value={formData.end_time}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <div className="text-center">
              <Button variant="success" type="submit">
                Update
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default DoctorSchedule;
