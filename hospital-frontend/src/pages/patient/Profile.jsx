import React, { useEffect, useState } from "react";
import { Button, Modal, Form, Spinner, Alert } from "react-bootstrap";
import { api, assetBase } from "../../api";

const PatientProfile = () => {
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    gender: "",
    photo: "",
    newPhoto: null,
  });

  const [preview, setPreview] = useState(null);

  // ✅ Fetch patient info
  useEffect(() => {
    const fetchPatient = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("No token found. Please login again.");
          setLoading(false);
          return;
        }

        // ✅ Fetch logged-in patient profile
        const res = await api.get("/patient/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const patientData = res.data;
        setPatient(patientData);
        setFormData({
          name: patientData.user?.name || "",
          phone: patientData.phone || "",
          address: patientData.address || "",
          gender: patientData.gender || "",
          photo: patientData.photo || "",
          newPhoto: null,
        });
        setPreview(patientData.photo);
      } catch (err) {
        console.error("❌ Failed to load patient profile:", err);
        setError("Failed to load patient data");
      } finally {
        setLoading(false);
      }
    };

    fetchPatient();
  }, []);

  // ✅ Update patient profile
  const handleUpdate = async () => {
    try {
      const token = localStorage.getItem("token");
      const data = new FormData();

      data.append("name", formData.name);
      data.append("phone", formData.phone);
      data.append("address", formData.address);
      data.append("gender", formData.gender);

      if (formData.newPhoto) {
        data.append("photo", formData.newPhoto);
      }

      const res = await api.put(`/patient/${patient.id}`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setPatient(res.data);
      setPreview(res.data.photo);
      setShowModal(false);
      alert("✅ Profile updated successfully!");
    } catch (err) {
      console.error("Update failed:", err);
      alert("❌ Update failed!");
    }
  };

  if (loading)
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" />
        <p>Loading patient profile...</p>
      </div>
    );

  if (error) return <Alert variant="danger">{error}</Alert>;

  return (
    <div className="container mt-4">
      <div
        className="card shadow p-4 border-0"
        style={{ borderRadius: "15px", maxWidth: "900px", margin: "0 auto" }}
      >
        <div className="d-flex align-items-start gap-4 flex-wrap">
          {/* Left Side: Photo */}
          <div className="text-center" style={{ marginRight: 10 }}>
            <img
              src={
                preview
                  ? preview.startsWith("blob:")
                    ? preview
                    : preview.startsWith("http")
                    ? preview
                    : `${assetBase}${preview.startsWith("/") ? preview : "/" + preview}`
                  : "/default-avatar.png"
              }
              alt="Patient"
              style={{
                width: 180,
                height: 180,
                borderRadius: "5%",
                objectFit: "cover",
                boxShadow: "0 0 10px rgba(0,0,0,0.15)",
              }}
            />
          </div>

          {/* Right Side: Info */}
          <div className="flex-grow-1">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h3 className="fw-bold mb-0">{formData.name || "Patient"}</h3>
              <Button variant="primary" onClick={() => setShowModal(true)}>
                Edit Profile
              </Button>
            </div>

            <p><strong>Phone:</strong> {formData.phone || "N/A"}</p>
            <p><strong>Address:</strong> {formData.address || "N/A"}</p>
            <p><strong>Gender:</strong> {formData.gender || "N/A"}</p>
          </div>
        </div>
      </div>

      {/* ✅ Edit Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Patient Profile</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-2">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>Phone</Form.Label>
              <Form.Control
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>Address</Form.Label>
              <Form.Control
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              />
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>Gender</Form.Label>
              <Form.Control
                as="select"
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </Form.Control>
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>Photo</Form.Label>
              <Form.Control
                type="file"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    setFormData({ ...formData, newPhoto: file });
                    setPreview(URL.createObjectURL(file));
                  }
                }}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleUpdate}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default PatientProfile;
