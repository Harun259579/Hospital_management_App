import React, { useEffect, useState } from "react";
import { Table, Form, Button } from "react-bootstrap";
import { api } from "../../api";
import { FaTrash } from "react-icons/fa";

const DoctorAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const res = await api.get("/appointments");
      console.log("API Response:", res.data);

      const data = Array.isArray(res.data) ? res.data : res.data.data || [];
      console.log("Appointments Array:", data);

      setAppointments(data);
    } catch (err) {
      console.error("Failed to fetch appointments:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    setUpdatingId(id);
    try {
      const res = await api.put(`/appointments/${id}`, { status: newStatus });
      setAppointments((prev) =>
        prev.map((appt) => (appt.id === id ? res.data : appt))
      );
    } catch (err) {
      alert("Failed to update status");
      console.error(err);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this appointment?")) return;
    setDeletingId(id);

    try {
      await api.delete(`/appointments/${id}`);
      setAppointments((prev) => prev.filter((appt) => appt.id !== id));
    } catch (err) {
      alert("Failed to delete appointment");
      console.error(err);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="container mt-4">
      <h3>My Appointments</h3>
      {loading ? (
        <p>Loading...</p>
      ) : appointments.length === 0 ? (
        <p>No appointments found.</p>
      ) : (
        <Table bordered hover responsive>
          <thead className="table-primary">
            <tr>
              <th>Patient Name</th>
              <th>Date</th>
              <th>Time</th>
              <th>Status</th>
              <th>Token</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((appt) => (
              <tr key={appt.id}>
                <td>{appt.patient?.user?.name || "N/A"}</td>
                <td>{appt.date}</td>
                <td>{appt.time}</td>
                <td>
                  <Form.Select
                    value={appt.status}
                    disabled={updatingId === appt.id}
                    onChange={(e) => handleStatusChange(appt.id, e.target.value)}
                  >
                    <option value="pending">Pending</option>
                    <option value="approved">Confirmed</option>
                    <option value="Cancelled">Cancelled</option>
                  </Form.Select>
                </td>
                <td>
                  {appt.token_id ? (
                    <code>{appt.token_id}</code>
                  ) : (
                    <span className="text-muted">N/A</span>
                  )}
                </td>
                <td>
                  <Button
                    variant="danger"
                    size="sm"
                    disabled={deletingId === appt.id}
                    onClick={() => handleDelete(appt.id)}
                  >
                    <FaTrash className="me-1" />
                    {deletingId === appt.id ? "Deleting..." : "Delete"}
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  );
};

export default DoctorAppointments;
