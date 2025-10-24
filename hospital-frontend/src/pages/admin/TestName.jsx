import React, { useEffect, useState } from "react";
import { Table, Button, Form, Container, Row, Col, Alert } from "react-bootstrap";
import { api } from "../../api"; 

const TestNames = () => {
  const [tests, setTests] = useState([]);
  const [formData, setFormData] = useState({ name: "", price: "" });
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch all test names
  const fetchTests = async () => {
    setLoading(true);
    try {
      const res = await api.get("/testnames");
      setTests(res.data || []);
    } catch (err) {
      console.error(err);
      setError("Failed to load test names.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTests();
  }, []);

  // Handle form input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Edit existing test - populate form
  const handleEdit = (test) => {
    setEditMode(true);
    setEditId(test.id);
    setFormData({ name: test.name, price: test.price });
    setMessage(null);
    setError(null);
  };

  // Cancel editing
  const handleCancelEdit = () => {
    setEditMode(false);
    setEditId(null);
    setFormData({ name: "", price: "" });
    setMessage(null);
    setError(null);
  };

  // Submit form (Add or Update)
  const handleSubmit = async (e) => {
  e.preventDefault();
  setMessage(null);
  setError(null);
  try {
    const payload = {
      name: formData.name,
      price: parseFloat(formData.price),  // number এ কনভার্ট
    };
    if (editMode) {
      await api.put(`/testnames/${editId}`, payload);
      setMessage("Test updated successfully!");
    } else {
      await api.post("/testnames", payload);
      setMessage("Test added successfully!");
    }
    setFormData({ name: "", price: "" });
    setEditMode(false);
    setEditId(null);
    fetchTests();
  } catch (err) {
    console.error(err);
    setError("Failed to save test.");
  }
};


  // Delete test
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this test?")) return;
    try {
      await api.delete(`/testnames/${id}`);
      setMessage("Test deleted successfully!");
      fetchTests();
    } catch (err) {
      console.error(err);
      setError("Failed to delete test.");
    }
  };

  return (
    <Container className="py-5">
      <h3 className="text-primary mb-4">Manage Test Names</h3>

      {message && <Alert variant="success">{message}</Alert>}
      {error && <Alert variant="danger">{error}</Alert>}

      {/* Inline Add/Edit Form */}
      <Form onSubmit={handleSubmit} className="mb-4">
        <Row className="align-items-end">
          <Col md={6}>
            <Form.Group controlId="testName">
              <Form.Label>Test Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter test name"
                required
              />
            </Form.Group>
          </Col>

          <Col md={4}>
            <Form.Group controlId="testPrice">
              <Form.Label>Price (৳)</Form.Label>
              <Form.Control
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                step="0.01"
                placeholder="Enter price"
                required
              />
            </Form.Group>
          </Col>

          <Col md={2}>
            <Button variant={editMode ? "warning" : "success"} type="submit" className="w-100">
              {editMode ? "Update" : "Add"}
            </Button>
            {editMode && (
              <Button
                variant="secondary"
                className="mt-2 w-100"
                onClick={handleCancelEdit}
                type="button"
              >
                Cancel
              </Button>
            )}
          </Col>
        </Row>
      </Form>

      {/* Test List Table */}
      {loading ? (
        <p>Loading...</p>
      ) : tests.length === 0 ? (
        <p>No tests found.</p>
      ) : (
        <Table bordered hover responsive>
          <thead className="table-primary">
            <tr>
              <th>#</th>
              <th>Test Name</th>
              <th>Price (৳)</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {tests.map((test, index) => (
              <tr key={test.id}>
                <td>{index + 1}</td>
                <td>{test.name}</td>
                <td>{test.price}</td>
                <td>
                  <Button
                    variant="warning"
                    size="sm"
                    className="me-2"
                    onClick={() => handleEdit(test)}
                  >
                    ✏️ Edit
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDelete(test.id)}
                  >
                    🗑️ Delete
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

export default TestNames;
