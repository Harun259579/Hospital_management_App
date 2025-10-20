import React, { useEffect, useState } from "react";
import { Table, Spinner, Alert, Button, Modal, Form, Image } from "react-bootstrap";
import { api } from "../../api";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import RegisterModal from "./RegisterModel"; 

const PatientsPage = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentPatient, setCurrentPatient] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    dob: "",
    phone: "",
    address: "",
    disease: "",
    photo: "",
    newPhoto: null,
  });

  // Fetch all patients
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await api.get("/patients", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPatients(res.data.data || []);
      } catch (err) {
        console.error(err);
        setError("Failed to load patients");
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, []);

  // Open edit modal and pre-fill patient data
  const handleEdit = (patient) => {
    setCurrentPatient(patient);
    setFormData({
      name: patient.user?.name || patient.name || "",
      email: patient.user?.email || patient.email || "",
      dob: patient.dob || "",
      phone: patient.phone || "",
      address: patient.address || "",
      disease: patient.disease || "",
      photo: patient.photo || "",
      newPhoto: null,
    });
    setShowEditModal(true);
  };

  // Handle input change
  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  // Handle file change (for new photo)
  const handleFileChange = (e) =>
    setFormData({ ...formData, newPhoto: e.target.files[0] });

  const handleSave = async () => {
  try {
    const token = localStorage.getItem("token");
    const data = new FormData();

    data.append("name", formData.name);
    data.append("email", formData.email);
    data.append("dob", formData.dob);
    data.append("phone", formData.phone);
    data.append("address", formData.address);
    data.append("disease", formData.disease);
    if (formData.newPhoto) data.append("photo", formData.newPhoto);

    const res = await api.put(`/patients/${currentPatient.id}`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });

    // Update list locally
    setPatients((prev) =>
      prev.map((p) => (p.id === currentPatient.id ? res.data : p))
    );

    setShowEditModal(false);
  } catch (err) {
    console.error("Failed to update patient:", err.response ? err.response.data : err);
    alert("Failed to save changes");
  }
};


  if (loading)
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" />
        <p>Loading patients...</p>
      </div>
    );

  if (error) return <Alert variant="danger">{error}</Alert>;

  return (
    <div>
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3>🧑‍ Patients List</h3>
        <Button variant="primary" onClick={() => setShowAddModal(true)}>
          Add New
        </Button>
      </div>

      {/* Table */}
      {patients.length === 0 ? (
        <Alert variant="info">No patients found</Alert>
      ) : (
        <Table striped bordered hover responsive className="shadow-sm">
          <thead className="table-info">
            <tr>
              <th>ID</th>
              <th>Photo</th>
              <th>Name</th>
              <th>Email</th>
              <th>DOB</th>
              <th>Phone</th>
              <th>Address</th>
              <th>Disease</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {patients.map((patient) => (
              <tr key={patient.id}>
                <td>{patient.id}</td>
                <td>
                  {patient.photo ? (
                    <Image
                      src={`http://127.0.0.1:8000${patient.photo}`}
                      roundedCircle
                      width={40}
                      height={40}
                    />
                  ) : (
                    "N/A"
                  )}
                </td>
                <td>{patient.user?.name || patient.name}</td>
                <td>{patient.user?.email || patient.email}</td>
                <td>{patient.dob}</td>
                <td>{patient.phone}</td>
                <td>{patient.address}</td>
                <td>{patient.disease}</td>
                <td>
                  <Button
                    variant="outline-primary"
                    size="sm"
                    className="me-2"
                    onClick={() => handleEdit(patient)}
                  >
                    <FiEdit />
                  </Button>
                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={() => handleDelete(patient.id)}
                  >
                    <FiTrash2 />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      {/* Add New Patient Modal */}
      <RegisterModal
        show={showAddModal}
        onHide={() => setShowAddModal(false)}
        roleDefault="patient"
      />

      {/* Edit Patient Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Patient</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            {/* Name */}
            <Form.Group className="mb-2">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter patient name"
              />
            </Form.Group>

            {/* Email */}
            <Form.Group className="mb-2">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter patient email"
              />
            </Form.Group>

            {/* Date of Birth */}
            <Form.Group className="mb-2">
              <Form.Label>Date of Birth</Form.Label>
              <Form.Control
                type="date"
                name="dob"
                value={formData.dob}
                onChange={handleChange}
              />
            </Form.Group>

            {/* Phone */}
            <Form.Group className="mb-2">
              <Form.Label>Phone</Form.Label>
              <Form.Control
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter phone number"
              />
            </Form.Group>

            {/* Address */}
            <Form.Group className="mb-2">
              <Form.Label>Address</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Enter patient address"
              />
            </Form.Group>

            {/* Disease */}
            <Form.Group className="mb-2">
              <Form.Label>Disease</Form.Label>
              <Form.Control
                type="text"
                name="disease"
                value={formData.disease}
                onChange={handleChange}
                placeholder="Enter disease name"
              />
            </Form.Group>

            {/* Photo */}
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
          <Button variant="primary" onClick={handleSave}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default PatientsPage;
