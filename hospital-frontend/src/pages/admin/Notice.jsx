import React, { useState, useEffect } from "react";
import { Form, Button, Card, Container, Alert, Spinner, Table } from "react-bootstrap";
import { api } from "../../api";


const NoticeCreate = () => {
  const [form, setForm] = useState({
    title: "",
    message: "",
    is_active: true,
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [notices, setNotices] = useState([]);
  const [fetching, setFetching] = useState(true);

  // Load existing notices
  const fetchNotices = async () => {
    try {
      setFetching(true);
      const token = localStorage.getItem("token");
      const res = await api.get("/notices", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotices(res.data.data || res.data || []);
    } catch (err) {
      console.error("Error loading notices:", err);
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchNotices();
  }, []);

  // Handle form input
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Handle new notice submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const token = localStorage.getItem("token");
      await api.post("/notices", form, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setSuccess("✅ Notice created successfully!");
      setForm({ title: "", message: "", is_active: true });
      fetchNotices(); // Refresh list
    } catch (err) {
      console.error("Error creating notice:", err);
      setError(err.response?.data?.message || "Failed to create notice.");
    } finally {
      setLoading(false);
    }
  };

  // Toggle notice active/deactivate
const handleToggle = async (id, currentStatus) => {
  console.log(`Toggling notice with ID: ${id}, currentStatus: ${currentStatus}`);

  try {
    const token = localStorage.getItem("token");
    const res = await api.put(
      `/notices/${id}`,
      { is_active: !currentStatus },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    // Directly update the status in the local notices array
    setNotices((prevNotices) => 
      prevNotices.map((notice) =>
        notice.id === id ? { ...notice, is_active: !currentStatus } : notice
      )
    );
    
    console.log('Toggle successful', res);
  } catch (err) {
    console.error("Error updating notice:", err);
    alert("Failed to update notice status.");
  }
};
const handleDelete = async (id) => {
  const confirmDelete = window.confirm("Are you sure you want to delete this notice?");
  if (!confirmDelete) return;

  try {
    const token = localStorage.getItem("token");
    await api.delete(`/notices/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    // Remove the deleted notice from state
    setNotices((prevNotices) => prevNotices.filter((notice) => notice.id !== id));
  } catch (err) {
    console.error("Error deleting notice:", err);
    alert("Failed to delete notice.");
  }
};


  return (
    <Container className="mt-5">
      <Card className="shadow p-4 border-0" style={{ maxWidth: "700px", margin: "0 auto" }}>
        <h3 className="text-center text-primary mb-4">📝 Create New Notice</h3>

        {success && <Alert variant="success">{success}</Alert>}
        {error && <Alert variant="danger">{error}</Alert>}

        {/* Notice Form */}
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Notice Title</Form.Label>
            <Form.Control
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Enter notice title"
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Notice Message</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="message"
              value={form.message}
              onChange={handleChange}
              placeholder="Write your notice message here..."
              required
            />
          </Form.Group>

          <Form.Group className="mb-3 d-flex align-items-center">
            <Form.Check
              type="checkbox"
              name="is_active"
              checked={form.is_active}
              onChange={handleChange}
              label="Active Notice"
            />
          </Form.Group>

          <div className="text-center">
            <Button variant="primary" type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Spinner size="sm" animation="border" /> Creating...
                </>
              ) : (
                "Create Notice"
              )}
            </Button>
          </div>
        </Form>
      </Card>

      {/* Notice List Table */}
      <Card className="shadow mt-5 p-3 border-0">
        <h4 className="text-primary mb-3 text-center">📋 All Notices</h4>

        {fetching ? (
          <div className="text-center my-4">
            <Spinner animation="border" /> Loading notices...
          </div>
        ) : notices.length > 0 ? (
          <Table bordered hover responsive className="align-middle">
            <thead>
              <tr className="text-center bg-light">
                <th>#</th>
                <th>Title</th>
                <th>Message</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
                     <tbody>
  {notices.map((notice, index) => (
    <tr key={notice.id} className="text-center">
      <td>{index + 1}</td>
      <td>{notice.title}</td>
      <td className="text-start">{notice.message}</td>
      <td>
        {notice.is_active ? (
          <span className="badge bg-success">Active</span>
        ) : (
          <span className="badge bg-secondary">Inactive</span>
        )}
      </td>
      <td className="d-flex justify-content-center gap-2">
      {/*  <Button
          variant={notice.is_active ? "outline-danger" : "outline-success"}
          size="sm"
          onClick={() => handleToggle(notice.id, notice.is_active)}
        >
          {notice.is_active ? "Deactivate" : "Activate"}
        </Button>*/}
        <Button
          variant="outline-danger"
          size="sm"
          onClick={() => handleDelete(notice.id)}
        >
          Delete
        </Button>
      </td>
    </tr>
  ))}
</tbody>


          </Table>
        ) : (
          <p className="text-center text-muted my-3">No notices found.</p>
        )}
      </Card>
    </Container>
  );
};

export default NoticeCreate;
