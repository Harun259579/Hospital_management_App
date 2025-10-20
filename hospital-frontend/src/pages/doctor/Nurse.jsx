import React, { useEffect, useState } from "react";
import { Table, Spinner, Alert } from "react-bootstrap";
import { api } from "../../api";

const NursesPage = () => {
  const [nurses, setNurses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
      <h3 className="mb-3">🧑‍ Nurses List</h3>

      {nurses.length === 0 ? (
        <Alert variant="info">No nurses found</Alert>
      ) : (
        <Table striped bordered hover responsive className="shadow-sm">
          <thead className="table-info">
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Address</th>
              <th>Shift</th>
            </tr>
          </thead>
          <tbody>
            {nurses.map((nurse) => (
              <tr key={nurse.id}>
                <td>{nurse.id}</td>
                <td>{nurse.user?.name || nurse.name}</td>
                <td>{nurse.user?.email || nurse.email}</td>
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
