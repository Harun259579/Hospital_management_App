import React, { useEffect, useState } from "react";
import { Button, Modal, Form, Spinner, Alert } from "react-bootstrap";
import { api, assetBase } from "../../api";

const AdminProfile = () => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    photo: "",
    newPhoto: null,
  });
  const [preview, setPreview] = useState(null);

  // ✅ Fetch admin info from /admin/my-profile
  useEffect(() => {
    const fetchAdmin = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("No token found. Please login again.");
          setLoading(false);
          return;
        }

        // ✅ Call backend endpoint
        const res = await api.get("/admin/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log("📸 Admin Data:", res.data);
        const adminData = res.data;

        setAdmin(adminData);
        setFormData({
          name: adminData.user?.name || "",
          email: adminData.user?.email || "",
          phone: adminData.phone || "",
          address: adminData.address || "",
          photo: adminData.photo || "",
          newPhoto: null,
        });
        setPreview(adminData.photo);
      } catch (err) {
        console.error("❌ Failed to load admin profile:", err);
        setError("Failed to load admin data");
      } finally {
        setLoading(false);
      }
    };

    fetchAdmin();
  }, []);

const handleUpdate = async () => {
  try {
    const token = localStorage.getItem("token");
    const data = new FormData();

    data.append("name", formData.name);
    data.append("email", formData.email);
    data.append("phone", formData.phone);
    data.append("address", formData.address);
    if (formData.newPhoto) data.append("photo", formData.newPhoto);

    const res = await api.put(`/admins/${admin.id}`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });

    console.log("✅ Updated Admin:", res.data);
    setAdmin(res.data);
    setPreview(res.data.photo);
    setShowModal(false);
    alert("✅ Profile updated successfully!");
  } catch (err) {
    console.error("❌ Update failed:", err);
    console.error("Error response:", err.response);  // Error details here
    if (err.response) {
      alert(`Error: ${err.response.data.message}`);
    } else {
      alert("An unknown error occurred. Please try again.");
    }
  }
};



  // ✅ Loading or error state
  if (loading)
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" />
        <p>Loading admin profile...</p>
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
          {/* ✅ Left: Photo */}
          <div className="text-center" style={{ marginRight: 10 }}>
            <img
              src={
                preview
                  ? preview.startsWith("blob:")
                    ? preview
                    : preview.startsWith("http")
                    ? preview
                    : `${assetBase}${
                        preview.startsWith("/") ? preview : "/" + preview
                      }`
                  : "/default-avatar.png"
              }
              alt="Admin"
              style={{
                width: 180,
                height: 180,
                borderRadius: "8px",
                objectFit: "cover",
                boxShadow: "0 0 10px rgba(0,0,0,0.15)",
              }}
            />
          </div>

          {/* ✅ Right: Info */}
          <div className="flex-grow-1">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h3 className="fw-bold mb-0">{formData.name || "Admin"}</h3>
              <Button variant="primary" onClick={() => setShowModal(true)}>
                Edit Profile
              </Button>
            </div>

            <p>
              <strong>Email:</strong> {formData.email || "N/A"}
            </p>
            <p>
              <strong>Phone:</strong> {formData.phone || "N/A"}
            </p>
            <p>
              <strong>Address:</strong> {formData.address || "N/A"}
            </p>
          </div>
        </div>
      </div>

      {/* ✅ Edit Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Admin Profile</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-2">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>Phone</Form.Label>
              <Form.Control
                type="text"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
              />
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>Address</Form.Label>
              <Form.Control
                type="text"
                value={formData.address}
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
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

export default AdminProfile;
