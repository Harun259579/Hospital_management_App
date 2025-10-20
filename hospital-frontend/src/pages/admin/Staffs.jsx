import React, { useEffect, useState } from "react";
import { Table, Spinner, Alert, Button, Modal, Form, Image } from "react-bootstrap";
import { api } from "../../api";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import RegisterModal from "../admin/RegisterModal";

const StaffsPage = () => {
  const [staffs, setStaffs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Add Modal
  const [showAddModal, setShowAddModal] = useState(false);

  // Edit Modal
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentStaff, setCurrentStaff] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    dob: "",
    gender: "",
    phone: "",
    address: "",
    shift: "",
    photo: "",
    newPhoto: null,
  });

  // Fetch all staffs
  useEffect(() => {
    const fetchStaffs = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await api.get("/staffs", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setStaffs(res.data.data || []);
      } catch (err) {
        console.error(err);
        setError("Failed to load staffs");
      } finally {
        setLoading(false);
      }
    };
    fetchStaffs();
  }, []);

  // Open Edit Modal
  const handleEdit = (staff) => {
    setCurrentStaff(staff);
    setFormData({
      name: staff.user?.name || staff.name,
      email: staff.user?.email || staff.email,
      dob: staff.dob || "",
      gender: staff.gender || "",
      phone: staff.phone || "",
      address: staff.address || "",
      shift: staff.shift || "morning",
      photo: staff.photo || "",
      newPhoto: null,
    });
    setShowEditModal(true);
  };

  // Handle form change
  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleFileChange = (e) => setFormData({ ...formData, newPhoto: e.target.files[0] });

  // Update Staff
  const handleUpdate = async () => {
    try {
      const token = localStorage.getItem("token");
      const data = new FormData();
      data.append("name", formData.name);
      data.append("email", formData.email);
      data.append("dob", formData.dob);
      data.append("gender", formData.gender);
      data.append("phone", formData.phone);
      data.append("address", formData.address);
      data.append("shift", formData.shift);
      if (formData.newPhoto) data.append("photo", formData.newPhoto);

      const res = await api.post(`/staffs/${currentStaff.id}?_method=PUT`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setStaffs((prev) =>
        prev.map((s) => (s.id === currentStaff.id ? res.data : s))
      );
      setShowEditModal(false);
    } catch (err) {
      console.error("Failed to update staff:", err);
      alert("Failed to save changes");
    }
  };

  // Delete Staff
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this staff?")) return;
    try {
      const token = localStorage.getItem("token");
      await api.delete(`/staffs/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStaffs((prev) => prev.filter((s) => s.id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete staff");
    }
  };

  if (loading)
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" />
        <p>Loading staffs...</p>
      </div>
    );

  if (error) return <Alert variant="danger">{error}</Alert>;

  return (
    <div>
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3>👷 Staffs List</h3>
        <Button variant="primary" onClick={() => setShowAddModal(true)}>
          Add New
        </Button>
      </div>

      {/* Table */}
      {staffs.length === 0 ? (
        <Alert variant="info">No staffs found</Alert>
      ) : (
        <Table striped bordered hover responsive className="shadow-sm">
          <thead className="table-warning">
            <tr>
              <th>ID</th>
              <th>Photo</th>
              <th>Name</th>
              <th>Email</th>
              <th>Gender</th>
              <th>Phone</th>
              <th>Address</th>
              <th>Shift</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {staffs.map((staff) => (
              <tr key={staff.id}>
                <td>{staff.id}</td>
                <td>
                  {staff.photo ? (
                    <Image
                      src={`http://127.0.0.1:8000${staff.photo}`}
                      roundedCircle
                      width={40}
                      height={40}
                    />
                  ) : (
                    "N/A"
                  )}
                </td>
                <td>{staff.user?.name || staff.name}</td>
                <td>{staff.user?.email || staff.email}</td>
                <td>{staff.gender}</td>
                <td>{staff.phone}</td>
                <td>{staff.address}</td>
                <td>{staff.shift}</td>
                <td>
                  <Button
                    variant="outline-primary"
                    size="sm"
                    className="me-2"
                    onClick={() => handleEdit(staff)}
                  >
                    <FiEdit />
                  </Button>
                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={() => handleDelete(staff.id)}
                  >
                    <FiTrash2 />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      {/* Add New Staff Modal */}
      <RegisterModal
        show={showAddModal}
        onHide={() => setShowAddModal(false)}
        roleDefault="staff"
      />

      {/* Edit Staff Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Staff</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                name="name"
                value={formData.name}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                name="email"
                value={formData.email}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Date of Birth</Form.Label>
              <Form.Control
                type="date"
                name="dob"
                value={formData.dob}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Gender</Form.Label>
              <Form.Select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Phone</Form.Label>
              <Form.Control
                name="phone"
                value={formData.phone}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Address</Form.Label>
              <Form.Control
                as="textarea"
                name="address"
                rows={3}
                value={formData.address}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Shift</Form.Label>
              <Form.Select
                name="shift"
                value={formData.shift}
                onChange={handleChange}
              >
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

export default StaffsPage;
