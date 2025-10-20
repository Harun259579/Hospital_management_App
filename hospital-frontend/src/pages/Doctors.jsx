import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { useLocation } from "react-router-dom";
import { api, assetBase } from "../api";

const Doctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const location = useLocation(); // to access the query params

  // Function to parse the search query from the URL
  const getSearchQuery = () => {
    const params = new URLSearchParams(location.search);
    return params.get("search") || "";
  };

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

  // Dynamically filter doctors based on the search query in URL
  useEffect(() => {
    const searchQuery = getSearchQuery().toLowerCase().trim();
    if (searchQuery) {
      const filtered = doctors.filter((doctor) => {
        const doctorName = doctor.user?.name?.toLowerCase() || "";
        const doctorBio = doctor.bio?.toLowerCase() || "";
        return (
          doctorName.includes(searchQuery) ||
          doctorBio.includes(searchQuery)
        );
      });
      setFilteredDoctors(filtered);
    } else {
      setFilteredDoctors(doctors); // No search query, show all doctors
    }
  }, [doctors, location.search]);

  return (
    <Container className="py-5 mt-5">
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
                      ? `${assetBase}${doc.photo}` // ✅ Here we use assetBase
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
                    {doc.specialities && doc.specialities.length > 0
                      ? doc.specialities.map((s) => s.name).join(", ")
                      : "General"}
                  </Card.Subtitle>
                  <Card.Text className="text-secondary small">
                    {doc.bio || "No bio available."}
                  </Card.Text>
                  <Card.Text>
                    <strong>Fee:</strong> ৳{doc.fee || "0.00"}
                    <br />
                    <strong>Address:</strong> {doc.visiting_address || "N/A"}
                  </Card.Text>
                  <Button variant="outline-primary" className="w-100">
                    View Profile
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))
        ) : (
          <p className="text-center text-muted">No doctors available</p>
        )}
      </Row>
    </Container>
  );
};

export default Doctors;
