import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Button, Modal } from "react-bootstrap";
import { useLocation } from "react-router-dom";
import { api, assetBase } from "../api";

const Doctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [doctorSchedule, setDoctorSchedule] = useState([]);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);
  const location = useLocation();

  // ✅ Get search query
  const getSearchQuery = () => {
    const params = new URLSearchParams(location.search);
    return params.get("search") || "";
  };

  // ✅ Fetch all doctors
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const res = await api.get("/doctors");
        console.log("Doctor API Response:", res.data);
        setDoctors(res.data.data || []);
      } catch (err) {
        console.error("Failed to load doctors:", err);
      }
    };
    fetchDoctors();
  }, []);

useEffect(() => {
  const fetchSchedule = async () => {
    if (selectedDoctor) {
      try {
        console.log(`Fetching schedule for doctor ID: ${selectedDoctor.id}`);
        const res = await api.get(`/doctor-shedules?doctor_id=${selectedDoctor.id}`);
        console.log("Schedule Response:", res.data);
        setDoctorSchedule(res.data || []);
      } catch (err) {
        console.error("Failed to load schedule:", err);
      }
    }
  };
  fetchSchedule();
}, [selectedDoctor]);




  // ✅ Filter by search
  useEffect(() => {
    const searchQuery = getSearchQuery().toLowerCase().trim();
    if (searchQuery) {
      const filtered = doctors.filter((doctor) => {
        const name = doctor.user?.name?.toLowerCase() || "";
        const bio = doctor.bio?.toLowerCase() || "";
        return name.includes(searchQuery) || bio.includes(searchQuery);
      });
      setFilteredDoctors(filtered);
    } else {
      setFilteredDoctors(doctors);
    }
  }, [doctors, location.search]);

  // ✅ Handle View Details click
  const handleViewDetails = (doctor) => {
    setSelectedDoctor(doctor);
    setShowDetailsModal(true);
  };

  // ✅ Handle Book Appointment click
  const handleBookAppointment = (doctor) => {
    setSelectedDoctor(doctor);
    setShowDetailsModal(false); // Close the details modal
    setTimeout(() => setShowAppointmentModal(true), 200); // Smooth transition to appointment modal
  };

  return (
    <Container className="py-5 mt-4">
      <h2 className="text-center text-primary mb-4">Our Doctors</h2>
      <Row className="g-4">
        {filteredDoctors.length > 0 ? (
          filteredDoctors.map((doc) => (
            <Col key={doc.id} xs={12} sm={6} md={4} lg={3}>
              <Card className="h-100 shadow-sm border-0 rounded-3">
                <Card.Img
                  variant="top"
                  src={
                    doc.photo
                      ? `${assetBase}${doc.photo}`
                      : "https://via.placeholder.com/300x200"
                  }
                  alt={doc.user?.name || "Doctor"}
                  style={{ height: "200px", objectFit: "cover" }}
                />
                <Card.Body>
                  <Card.Title className="fw-bold text-primary">
                    {doc.user?.name || "Unnamed Doctor"}
                  </Card.Title>
                  <Card.Subtitle className="mb-2 text-muted">
                    {doc.specialities?.length
                      ? doc.specialities.map((s) => s.name).join(", ")
                      : "General"}
                  </Card.Subtitle>
                  <Card.Text className="text-secondary small">
                    {doc.bio || "No bio available."}
                  </Card.Text>
                  <Card.Text>
                    <strong>Fee:</strong> ৳{doc.fee || "0.00"} <br />
                    <strong>Address:</strong> {doc.visiting_address || "N/A"}
                  </Card.Text>

                  {/* ✅ Buttons */}
                  <Row className="mt-3">
                    <Col
                      className="d-flex justify-content-center"
                      style={{ gap: "10px" }}
                    >
                      <Button
                        variant="outline-primary"
                        size="sm"
                        onClick={() => handleBookAppointment(doc)}
                      >
                        Book Appointment
                      </Button>
                      <Button
                        variant="outline-success"
                        size="sm"
                        onClick={() => handleViewDetails(doc)}
                      >
                        View Details
                      </Button>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>
          ))
        ) : (
          <p className="text-center text-muted">No doctors available</p>
        )}
      </Row>

      {/* ✅ Doctor Details Modal */}
      <Modal
        show={showDetailsModal}
        onHide={() => setShowDetailsModal(false)}
        centered
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {selectedDoctor?.user?.name || "Doctor Details"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedDoctor && (
            <Row>
              <Col md={5} className="text-center mb-3">
                <img
                  src={
                    selectedDoctor.photo
                      ? `${assetBase}${selectedDoctor.photo}`
                      : "https://via.placeholder.com/300x300"
                  }
                  alt="Doctor"
                  style={{
                    width: "100%",
                    height: "300px",
                    objectFit: "cover",
                    borderRadius: "10px",
                  }}
                />
              </Col>
              <Col md={7}>
                <h4 className="text-primary mb-2">
                  {selectedDoctor.user?.name}
                </h4>
                <p className="text-muted mb-1">
                  <strong>Specialities:</strong>{" "}
                  {selectedDoctor.specialities?.length
                    ? selectedDoctor.specialities.map((s) => s.name).join(", ")
                    : "General"}
                </p>
                <p>
                  <strong>Fee:</strong> ৳{selectedDoctor.fee || "0.00"}
                </p>
                <p>
                  <strong>Address:</strong>{" "}
                  {selectedDoctor.visiting_address || "N/A"}
                </p>
                <p>
                  <strong>Bio:</strong>{" "}
                  {selectedDoctor.bio || "No bio information available."}
                </p>
                <p>
                  <strong>Phone:</strong>{" "}
                  {selectedDoctor.user?.phone || "N/A"}
                </p>
                <p>
                  <strong>Email:</strong>{" "}
                  {selectedDoctor.user?.email || "N/A"}
                </p>
              </Col>
            </Row>
          )}

        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDetailsModal(false)}>
            Close
          </Button>
          <Button
            variant="primary"
            onClick={() => handleBookAppointment(selectedDoctor)}
          >
            Book Appointment
          </Button>
        </Modal.Footer>
      </Modal>

      {/* ✅ Book Appointment Modal */}
      <Modal
        show={showAppointmentModal}
        onHide={() => setShowAppointmentModal(false)}
        centered
      >
        <Modal.Header closeButton>
         {/* <Modal.Title>🏥 Adil Specialized Hospital</Modal.Title>*/}
        </Modal.Header>
        <Modal.Body className="text-center">

                    {/* Display the doctor's schedule */}
         {/* Display the doctor's schedule */}
          <h5>Consultation Schedule</h5>
          <table className="table table-bordered table-striped table-hover">
            <thead className="table-primary">
              <tr>
                <th>Day</th>
                <th>Start Time</th>
                <th>End Time</th>
              </tr>
            </thead>
            <tbody>
              {doctorSchedule.length > 0 ? (
                doctorSchedule.map((schedule) => (
                  <tr key={schedule.id}>
                    <td><strong>{schedule.day_of_week}</strong></td>
                    <td>{schedule.start_time}</td>
                    <td>{schedule.end_time}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="text-center text-muted">
                    No schedule available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>




         <div style={{ backgroundColor: '#f8d7da', padding: '16px', borderRadius: '8px' }}>
          <p className="fs-5 fw-semibold text-danger">
            If you want to book an appointment with{" "}
            <strong>{selectedDoctor?.user?.name}</strong>,
          </p>
          <p className="mb-0">
            please contact our compounder at: <br />
            📞 <strong>01730229409</strong>
          </p>
        </div>

        </Modal.Body>
                <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAppointmentModal(false)}>
            Close
          </Button>

          {doctorSchedule.length > 0 && (
            <Button
              variant="primary"
              onClick={() => {
                // You can trigger booking action here
                alert(`Please login our Application Then You can Booking for ${selectedDoctor?.user?.name}`);
              }}
            >
              Book Appointment
            </Button>
          )}
        </Modal.Footer>

      </Modal>
    </Container>
  );
};

export default Doctors;
