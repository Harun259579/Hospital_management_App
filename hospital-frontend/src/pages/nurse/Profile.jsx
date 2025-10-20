import React, { useEffect, useState } from "react";
import { Button, Modal, Form, Spinner, Alert } from "react-bootstrap";
import { api, assetBase } from "../../api";

const NurseProfile = () => {
  const [nurse, setNurse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    shift: "morning",
    gender: "",
    photo: "",
    newPhoto: null,
  });

  const [preview, setPreview] = useState(null);

  // ✅ Fetch nurse info
  useEffect(() => {
    const fetchNurse = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("No token found. Please login again.");
          setLoading(false);
          return;
        }

        // ✅ Fetch logged-in nurse profile
        const res = await api.get("/nurse/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const nurseData = res.data;
        setNurse(nurseData);
        setFormData({
          name: nurseData.user?.name || "",
          phone: nurseData.phone || "",
          address: nurseData.address || "",
          shift: nurseData.shift || "morning",
          gender: nurseData.gender || "",
          photo: nurseData.photo || "",
          newPhoto: null,
        });
        setPreview(nurseData.photo);
      } catch (err) {
        console.error("❌ Failed to load nurse profile:", err);
        setError("Failed to load nurse data");
      } finally {
        setLoading(false);
      }
    };

    fetchNurse();
  }, []);

  // ✅ Update nurse profile
  const handleUpdate = async () => {
    try {
      const token = localStorage.getItem("token");
      const data = new FormData();

      data.append("name", formData.name);
      data.append("phone", formData.phone);
      data.append("address", formData.address);
      data.append("shift", formData.shift);
      data.append("gender", formData.gender);

      if (formData.newPhoto) {
        data.append("photo", formData.newPhoto);
      }

      const res = await api.put(`/nurse/${nurse.id}`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setNurse(res.data);
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
        <p>Loading nurse profile...</p>
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
              alt="Nurse"
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
              <h3 className="fw-bold mb-0">{formData.name || "Nurse"}</h3>
              <Button variant="primary" onClick={() => setShowModal(true)}>
                Edit Profile
              </Button>
            </div>

            <p><strong>Phone:</strong> {formData.phone || "N/A"}</p>
            <p><strong>Address:</strong> {formData.address || "N/A"}</p>
            <p><strong>Shift:</strong> {formData.shift || "N/A"}</p>
            <p><strong>Gender:</strong> {formData.gender || "N/A"}</p>
          </div>
        </div>
      </div>

      {/* ✅ Edit Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Nurse Profile</Modal.Title>
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
              <Form.Label>Shift</Form.Label>
              <Form.Control
                as="select"
                value={formData.shift}
                onChange={(e) => setFormData({ ...formData, shift: e.target.value })}
              >
                <option value="morning">Morning</option>
                <option value="evening">Evening</option>
                <option value="night">Night</option>
              </Form.Control>
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

export default NurseProfile;
