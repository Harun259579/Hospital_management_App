import React, { useEffect, useState } from "react";
import { Table, Spinner, Alert, Button, Modal, Form, Image } from "react-bootstrap";
import { api } from "../../api";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import RegisterModal from "../admin/RegisterModal";

const DoctorsPage = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Add Modal
  const [showAddModal, setShowAddModal] = useState(false);

  // Edit Modal
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentDoctor, setCurrentDoctor] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    bio: "",
    fee: "",
    visiting_address: "",
    shift: "morning",
    photo: "",
    newPhoto: null,
  });

  // Fetch doctors
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await api.get("/doctors", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setDoctors(res.data.data || []);
      } catch (err) {
        console.error(err);
        setError("Failed to load doctors");
      } finally {
        setLoading(false);
      }
    };
    fetchDoctors();
  }, []);

  // Open Edit Modal
  const handleEdit = (doctor) => {
    setCurrentDoctor(doctor);
    setFormData({
      name: doctor.user?.name || doctor.name,
      email: doctor.user?.email || doctor.email,
      bio: doctor.bio || "",
      fee: doctor.fee || "",
      visiting_address: doctor.visiting_address || "",
      shift: doctor.shift || "morning",
      photo: doctor.photo || "",
      newPhoto: null,
    });
    setShowEditModal(true);
  };

  // Input change handlers
  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleFileChange = (e) => setFormData({ ...formData, newPhoto: e.target.files[0] });

  // Update doctor
  const handleUpdate = async () => {
    try {
      const token = localStorage.getItem("token");
      const data = new FormData();

     
    

      data.append("name", formData.name);
      data.append("email", formData.email);
      data.append("bio", formData.bio);
      data.append("fee", formData.fee);
      data.append("visiting_address", formData.visiting_address);
      data.append("shift", formData.shift);
      if (formData.newPhoto) data.append("photo", formData.newPhoto);

      const res = await api.post(`/doctors/${currentDoctor.id}?_method=PUT`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      // Update doctor list
      setDoctors((prev) =>
        prev.map((doc) => (doc.id === currentDoctor.id ? res.data : doc))
      );
      setShowEditModal(false);
    } catch (err) {
      console.error("Failed to update doctor:", err.response?.data || err);
      alert("Failed to save changes");
    }
  };

  // Delete doctor
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this doctor?")) return;
    try {
      const token = localStorage.getItem("token");
      await api.delete(`/doctors/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDoctors((prev) => prev.filter((d) => d.id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete doctor");
    }
  };

  if (loading)
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" />
        <p>Loading doctors...</p>
      </div>
    );

  if (error) return <Alert variant="danger">{error}</Alert>;

  return (
    <div>
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3>👨‍⚕️ Doctors List</h3>
        <Button variant="primary" onClick={() => setShowAddModal(true)}>
          Add New
        </Button>
      </div>

      {/* Table */}
      {doctors.length === 0 ? (
        <Alert variant="info">No doctors found</Alert>
      ) : (
        <Table striped bordered hover responsive className="shadow-sm">
          <thead className="table-primary">
            <tr>
              <th>ID</th>
              <th>Photo</th>
              <th>Name</th>
              <th>Email</th>
              <th>Fee</th>
              <th>Shift</th>
              <th>Visiting Address</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {doctors.map((doctor) => (
              <tr key={doctor.id}>
                <td>{doctor.id}</td>
                <td>
                  {doctor.photo ? (
                    <Image
                      src={`http://127.0.0.1:8000${doctor.photo}`}
                      roundedCircle
                      width={40}
                      height={40}
                    />
                  ) : (
                    "N/A"
                  )}
                </td>
                <td>{doctor.user?.name || doctor.name}</td>
                <td>{doctor.user?.email || doctor.email}</td>
                <td>{doctor.fee}</td>
                <td>{doctor.shift}</td>
                <td>{doctor.visiting_address}</td>
                <td>
                  <Button
                    variant="outline-primary"
                    size="sm"
                    className="me-2"
                    onClick={() => handleEdit(doctor)}
                  >
                    <FiEdit />
                  </Button>
                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={() => handleDelete(doctor.id)}
                  >
                    <FiTrash2 />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      {/* Add Doctor Modal */}
      <RegisterModal
        show={showAddModal}
        onHide={() => setShowAddModal(false)}
        roleDefault="doctor"
      />

      {/* Edit Doctor Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Doctor</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control name="name" value={formData.name} onChange={handleChange} />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control name="email" value={formData.email} onChange={handleChange} />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Bio</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="bio"
                value={formData.bio}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Fee</Form.Label>
              <Form.Control name="fee" value={formData.fee} onChange={handleChange} />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Visiting Address</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                name="visiting_address"
                value={formData.visiting_address}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Shift</Form.Label>
              <Form.Select name="shift" value={formData.shift} onChange={handleChange}>
                <option value="morning">Morning</option>
                <option value="evening">Evening</option>
                <option value="night">Night</option>
              </Form.Select>
            </Form.Group>

            <Form.Group>
              <Form.Label>Photo</Form.Label>
              <div className="mb-2">
                {formData.photo && (
                  <Image
                    src={`http://127.0.0.1:8000${formData.photo}`}
                    rounded
                    width={80}
                    height={80}
                    className="me-2"
                  />
                )}
              </div>
              <Form.Control type="file" onChange={handleFileChange} />
            </Form.Group>
          </Form>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
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

export default DoctorsPage;
