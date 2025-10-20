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
                
              </tr>
            ))}
          </tbody>
        </Table>
      )}

     
      
    </div>
  );
};

export default DoctorsPage;
