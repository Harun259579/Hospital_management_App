import React, { useEffect, useState } from "react";
import { Table, Spinner, Alert } from "react-bootstrap";
import { api } from "../../api";

const PatientsTableOnly = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

  if (loading)
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" />
        <p>Loading patients...</p>
      </div>
    );

  if (error) return <Alert variant="danger">{error}</Alert>;

  if (patients.length === 0)
    return <Alert variant="info">No patients found</Alert>;

  return (
    <Table striped bordered hover responsive className="shadow-sm">
      <thead className="table-info">
        <tr>
          <th>ID</th>
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
  );
};

export default PatientsTableOnly;
