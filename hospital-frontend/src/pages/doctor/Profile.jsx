import React, { useEffect, useState } from "react";
import { Button, Modal, Form, Spinner, Alert } from "react-bootstrap";
import { api, assetBase } from "../../api";


const DoctorProfile = () => {
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    address: "",
    bio: "",
    fee: "",
    photo: "",
    newPhoto: null,
  });

  const [preview, setPreview] = useState(null);

  // ✅ Fetch doctor info
useEffect(() => {
  const fetchDoctor = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No token found. Please login again.");
        setLoading(false);
        return;
      }

      // ✅ Directly fetch logged-in doctor profile
      const res = await api.get("/doctor/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("📸 Doctor Data:", res.data);

      const doctorData = res.data;
      setDoctor(doctorData);
      setFormData({
        name: doctorData.user?.name || "",
        email: doctorData.user?.email || "",
        address: doctorData.visiting_address || "",
        bio: doctorData.bio || "",
        fee: doctorData.fee || "",
        photo: doctorData.photo || "",
        newPhoto: null,
      });
      setPreview(doctorData.photo);
    } catch (err) {
      console.error("❌ Failed to load doctor profile:", err);
      setError("Failed to load doctor data");
    } finally {
      setLoading(false);
    }
  };

  fetchDoctor();
}, []);


  // ✅ Update profile
  const handleUpdate = async () => {
    try {
      const token = localStorage.getItem("token");
      const data = new FormData();

      data.append("name", formData.name);
      data.append("email", formData.email);
      data.append("visiting_address", formData.address);
      data.append("bio", formData.bio);
      data.append("fee", formData.fee);

      if (formData.newPhoto) {
        data.append("photo", formData.newPhoto);
      }

      const res = await api.put(`/doctors/${doctor.id}`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setDoctor(res.data);
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
        <p>Loading doctor profile...</p>
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
          <div className="text-center" style={{marginRight:10}}>
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
              alt="Doctor"
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
              <h3 className="fw-bold mb-0">{formData.name || "Doctor"}</h3>
              <Button variant="primary" onClick={() => setShowModal(true)}>
                Edit Profile
              </Button>
            </div>

            <p><strong>Email:</strong> {formData.email || "N/A"}</p>
            
            <p><strong>Address:</strong> {formData.address || "N/A"}</p>
            <p><strong>Bio:</strong> {formData.bio || "N/A"}</p>
            <p><strong>Fee:</strong> {formData.fee || "N/A"} BDT</p>
          </div>
        </div>
      </div>

      {/* ✅ Edit Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Doctor Profile</Modal.Title>
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
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
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
              <Form.Label>Bio</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              />
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>Fee</Form.Label>
              <Form.Control
                type="number"
                value={formData.fee}
                onChange={(e) => setFormData({ ...formData, fee: e.target.value })}
              />
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

export default DoctorProfile;
