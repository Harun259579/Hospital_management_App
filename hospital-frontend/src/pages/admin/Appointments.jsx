import React, { useEffect, useState } from "react";
import { Table, Spinner, Alert } from "react-bootstrap";
import { api } from "../../api";

const AppointmentsPage = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await api.get("/appointments", {
          headers: { Authorization: `Bearer ${token}` },
        });
        // Pagination থাকলে data array বের করা
        setAppointments(res.data.data || res.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load appointments data");
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  if (loading)
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" />
        <p>Loading appointments...</p>
      </div>
    );

  if (error) return <Alert variant="danger">{error}</Alert>;

  return (
    <div className="container mt-4">
      <h3 className="mb-3">📅 Appointments List</h3>

      {appointments.length === 0 ? (
        <Alert variant="info">No appointments found</Alert>
      ) : (
        <Table striped bordered hover responsive className="shadow-sm">
          <thead className="table-primary">
            <tr>
              <th>ID</th>
              <th>Patient ID</th>
              <th>Doctor ID</th>
              <th>Date</th>
              <th>Time</th>
              <th>Status</th>
              <th>Token ID</th>
              <th>Fee Snapshot</th>
              <th>Created By</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((item) => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.patient_id}</td>
                <td>{item.doctor_id}</td>
                <td>{item.date}</td>
                <td>{item.time}</td>
                <td>{item.status}</td>
                <td>{item.token_id || "—"}</td>
                <td>{item.fee_snapshot}</td>
                <td>{item.created_by}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  );
};

export default AppointmentsPage;
