import React, { useEffect, useState } from "react";
import { Table, Spinner, Alert } from "react-bootstrap";
import { api } from "../../api";

const DoctorsPage = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ✅ Fetch doctors list
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
      <h3 className="mb-3">👨‍⚕️ Doctors List</h3>

      {doctors.length === 0 ? (
        <Alert variant="info">No doctors found</Alert>
      ) : (
        <Table striped bordered hover responsive className="shadow-sm">
          <thead className="table-primary">
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Bio</th>
              <th>Fee</th>
              <th>Shift</th>
              <th>Address</th>
            </tr>
          </thead>
          <tbody>
            {doctors.map((doc) => (
              <tr key={doc.id}>
                <td>{doc.id}</td>
                <td>{doc.user?.name || doc.name}</td>
                <td>{doc.user?.email || doc.email}</td>
                <td>{doc.bio}</td>
                <td>{doc.fee}</td>
                <td>{doc.shift}</td>
                <td>{doc.visiting_address}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  );
};

export default DoctorsPage;
