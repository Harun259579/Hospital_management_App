import React, { useEffect, useState } from "react";
import { Table, Spinner, Alert, Button, Modal, Form, Image } from "react-bootstrap";
import { api } from "../../api";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import RegisterModal from "../admin/RegisterModal";

const NursesPage = () => {
  const [nurses, setNurses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Add Modal
  const [showAddModal, setShowAddModal] = useState(false);

  // Edit Modal
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentNurse, setCurrentNurse] = useState(null);
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

  // Fetch all nurses
  useEffect(() => {
    const fetchNurses = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await api.get("/nurses", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setNurses(res.data.data || []);
      } catch (err) {
        console.error(err);
        setError("Failed to load nurses");
      } finally {
        setLoading(false);
      }
    };
    fetchNurses();
  }, []);

  // Open Edit Modal
  const handleEdit = (nurse) => {
    setCurrentNurse(nurse);
    setFormData({
      name: nurse.user?.name || nurse.name,
      email: nurse.user?.email || nurse.email,
      dob: nurse.dob || "",
      gender: nurse.gender || "",
      phone: nurse.phone || "",
      address: nurse.address || "",
      shift: nurse.shift || "morning",
      photo: nurse.photo || "",
      newPhoto: null,
    });
    setShowEditModal(true);
  };

  // Handle change
  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleFileChange = (e) => setFormData({ ...formData, newPhoto: e.target.files[0] });

  // Update nurse
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

      const res = await api.post(`/nurses/${currentNurse.id}?_method=PUT`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setNurses((prev) =>
        prev.map((n) => (n.id === currentNurse.id ? res.data : n))
      );
      setShowEditModal(false);
    } catch (err) {
      console.error("Failed to update nurse:", err);
      alert("Failed to save changes");
    }
  };

  // Delete
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this nurse?")) return;
    try {
      const token = localStorage.getItem("token");
      await api.delete(`/nurses/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNurses((prev) => prev.filter((n) => n.id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete nurse");
    }
  };

  if (loading)
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" />
        <p>Loading nurses...</p>
      </div>
    );

  if (error) return <Alert variant="danger">{error}</Alert>;

  return (
    <div>
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3>🧑‍ Nurses List</h3>
       
      </div>

      {/* Table */}
      {nurses.length === 0 ? (
        <Alert variant="info">No nurses found</Alert>
      ) : (
        <Table striped bordered hover responsive className="shadow-sm">
          <thead className="table-info">
            <tr>
              <th>ID</th>
              <th>Photo</th>
              <th>Name</th>
              <th>Email</th>
              <th>Gender</th>
              <th>Phone</th>
              <th>Address</th>
              <th>Shift</th>
              
            </tr>
          </thead>
          <tbody>
            {nurses.map((nurse) => (
              <tr key={nurse.id}>
                <td>{nurse.id}</td>
                <td>
                  {nurse.photo ? (
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
                <td>{nurse.user?.name || nurse.name}</td>
                <td>{nurse.user?.email || nurse.email}</td>
                <td>{nurse.gender}</td>
                <td>{nurse.phone}</td>
                <td>{nurse.address}</td>
                <td>{nurse.shift}</td>
                
              </tr>
            ))}
          </tbody>
        </Table>
      )}

     
    </div>
  );
};

export default NursesPage;
