import React, { useEffect, useState } from "react";
import { Table, Form, Button, Container, Alert } from "react-bootstrap";
import { api } from "../../api";

const StaffTests = () => {
  const [tests, setTests] = useState([]);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

  // Fetch all tests (for staff)
  const fetchTests = async () => {
    try {
      const res = await api.get("/staff/tests"); // backend route for staff to get all tests
      setTests(res.data || []);
    } catch (err) {
      console.error(err);
      setError("Failed to load tests.");
    }
  };

  useEffect(() => {
    fetchTests();
  }, []);

  // Handle status update
  const handleStatusChange = async (testId, newStatus) => {
    setError(null);
    setMessage(null);

    try {
      const res = await api.patch(`/tests/${testId}/status`, { status: newStatus });
      setTests((prevTests) =>
        prevTests.map((test) =>
          test.id === testId ? { ...test, status: res.data.status, token_id: res.data.token_id } : test
        )
      );
      setMessage(`Status updated to "${newStatus}" successfully.`);
    } catch (err) {
      console.error(err);
      setError("Failed to update status.");
    }
  };

  // Dummy download handler
  const handleDownload = (test) => {
    if (!test.token_id) return alert("Token not generated yet!");
    // Normally here you will download or fetch the result file
    alert(`Downloading result for Test ID: ${test.id} with Token: ${test.token_id}`);
  };

  return (
    <Container className="py-5">
      <h3 className="mb-4 text-primary">Manage Tests (Staff Panel)</h3>

      {message && <Alert variant="success">{message}</Alert>}
      {error && <Alert variant="danger">{error}</Alert>}

      {tests.length === 0 ? (
        <p>No tests found.</p>
      ) : (
        <Table bordered hover responsive>
          <thead className="table-primary">
            <tr>
              <th>Test Name</th>
              <th>Price (৳)</th>
              <th>Date</th>
              <th>Status</th>
              <th>Token</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {tests.map((test) => (
              <tr key={test.id}>
                <td>{test.test_name}</td>
                <td>{test.price}</td>
                <td>{test.date}</td>
                <td>
                  <Form.Select
                    size="sm"
                    value={test.status}
                    onChange={(e) => handleStatusChange(test.id, e.target.value)}
                  >
                    <option value="pending">Pending</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </Form.Select>
                </td>
                <td>{test.token_id || "-"}</td>
                <td>
                  <Button
                    variant="success"
                    size="sm"
                    className="me-2"
                    onClick={() => handleDownload(test)}
                    disabled={!test.token_id}
                  >
                    Download
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Container>
  );
};

export default StaffTests;
