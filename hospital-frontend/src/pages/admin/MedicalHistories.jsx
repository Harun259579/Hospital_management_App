import React, { useEffect, useState } from "react";
import { Table, Spinner, Alert } from "react-bootstrap";
import { api } from "../../api";

const MedicalHistoriesPage = () => {
  const [histories, setHistories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchHistories = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await api.get("/medical-histories", {
          headers: { Authorization: `Bearer ${token}` },
        });
        // যদি pagination থাকে
        setHistories(res.data.data || res.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load medical history data");
      } finally {
        setLoading(false);
      }
    };

    fetchHistories();
  }, []);

  if (loading)
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" />
        <p>Loading medical history...</p>
      </div>
    );

  if (error) return <Alert variant="danger">{error}</Alert>;

  return (
    <div className="container mt-4">
      <h3 className="mb-3">🩺 Medical History</h3>

      {histories.length === 0 ? (
        <Alert variant="info">No medical history found</Alert>
      ) : (
        <Table striped bordered hover responsive className="shadow-sm">
          <thead className="table-primary">
            <tr>
              <th>ID</th>
              <th>Patient ID</th>
              <th>Doctor ID</th>
              <th>Diagnosis</th>
              <th>Prescription</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {histories.map((h) => (
              <tr key={h.id}>
                <td>{h.id}</td>
                <td>{h.patient_id}</td>
                <td>{h.doctor_id}</td>
                <td>{h.diagnosis || "—"}</td>
                <td>{h.prescription || "—"}</td>
                <td>{h.date}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  );
};

export default MedicalHistoriesPage;
