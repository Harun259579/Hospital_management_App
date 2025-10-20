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
               
              </tr>
            ))}
          </tbody>
        </Table>
      )}

    </div>
  );
};

export default StaffsPage;
