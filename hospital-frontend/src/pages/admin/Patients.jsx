import React, { useEffect, useState } from "react";
import { Table, Spinner, Alert, Button, Modal, Form, Image } from "react-bootstrap";
import { api } from "../../api";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import RegisterModal from "../admin/RegisterModal"; // Assuming you have a RegisterModal for adding new patients

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

  // Save edited patient details
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
      console.error("Failed to update patient:", err);
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
            
            </tr>
          </thead>
          <tbody>
            {patients.map((patient) => (
              <tr key={patient.id}>
                <td>{patient.id}</td>
                <td>
                  {patient.photo ? (
                    <Image
                      src={`http://127.0.0.1:8000${nurse.photo}`}
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
                
                
              </tr>
            ))}
          </tbody>
        </Table>
      )}

     

     
    </div>
  );
};

export default PatientsPage;
