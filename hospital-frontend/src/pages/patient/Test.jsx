import React, { useEffect, useState } from "react";
import { Table, Form, Button, Container, Row, Col, Alert } from "react-bootstrap";
import { api } from "../../api";
import { FaDownload, FaTrash } from "react-icons/fa";



const Tests = () => {
  const [tests, setTests] = useState([]);
  const [testNames, setTestNames] = useState([]);
  const [selectedTests, setSelectedTests] = useState([]); // Array of selected tests objects
  const [date, setDate] = useState("");
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const fetchTests = async () => {
    try {
      const res = await api.get("/tests");
      setTests(res.data || []);
    } catch (err) {
      console.error(err);
      setError("Failed to load tests.");
    }
  };

  const fetchTestNames = async () => {
    try {
      const res = await api.get("/testnames");
      setTestNames(res.data || []);
    } catch (err) {
      console.error(err);
      setError("Failed to load test names.");
    }
  };

  useEffect(() => {
    fetchTests();
    fetchTestNames();
  }, []);

  // Handle multiple select change
  const handleTestNamesChange = (e) => {
    const selectedOptions = Array.from(e.target.selectedOptions);
    // Map selected options to test objects from testNames list
    const selected = selectedOptions
      .map((option) => testNames.find((t) => t.name === option.value))
      .filter(Boolean); // remove null if any

    setSelectedTests(selected);
  };

  // Handle date change
  const handleDateChange = (e) => {
    setDate(e.target.value);
  };

  // Calculate total price
  const totalPrice = selectedTests.reduce((acc, test) => acc + Number(test.price), 0);

 const handleSubmit = async (e) => {
  e.preventDefault();
  setMessage(null);
  setError(null);

  if (selectedTests.length === 0) {
    setError("Please select at least one test.");
    return;
  }
  if (!date) {
    setError("Please select a date.");
    return;
  }

  try {
    for (const test of selectedTests) {
      const payload = {
        test_name: test.name,
        price: test.price,
        date: date,
      };
      await api.post("/tests", payload);
    }

    setMessage("Tests booked successfully!");
    setSelectedTests([]);
    setDate("");
    fetchTests();
  } catch (err) {
    console.error(err);
    setError("Failed to book tests.");
  }
};


  const handleDelete = async (id) => {
    if (!window.confirm("Delete this test?")) return;
    try {
      await api.delete(`/tests/${id}`);
      setTests((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      console.error(err);
      setError("Failed to delete test.");
    }
  };

  const handleDownload = (test) => {
    const content = `
🏥 Test Details
-------------------------
Test Name: ${test.test_name}
Price: ৳${test.price}
Date: ${test.date}
Status: ${test.status}
Token: ${test.token_id || "N/A"}
-------------------------
Thank you for using our services.
  `;

    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Test-${test.test_name}-${test.date}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Container className="py-5">
      <h3 className="mb-4 text-primary">Book Tests</h3>
      {message && <Alert variant="success">{message}</Alert>}
      {error && <Alert variant="danger">{error}</Alert>}

      <Form onSubmit={handleSubmit} className="mb-4">
        <Row>
          <Col md={6}>
            <Form.Group>
              <Form.Label>Select Tests (multiple)</Form.Label>
              <Form.Control
                as="select"
                multiple
                value={selectedTests.map((t) => t.name)}
                onChange={handleTestNamesChange}
                required
              >
                {testNames.map((test) => (
                  <option key={test.id} value={test.name}>
                    {test.name} (৳{test.price})
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
          </Col>

          <Col md={3}>
            <Form.Group>
              <Form.Label>Date</Form.Label>
              <Form.Control type="date" value={date} onChange={handleDateChange} required />
            </Form.Group>
          </Col>

          <Col md={3} className="d-flex align-items-end">
            <div>
              <div className="mb-2">Total Price: ৳{totalPrice}</div>
              <Button type="submit" variant="primary" className="w-100">
                Book Tests
              </Button>
            </div>
          </Col>
        </Row>
      </Form>

      <h4 className="text-success mb-3">My Tests</h4>
      {tests.length === 0 ? (
        <p>No tests found.</p>
      ) : (
        <Table bordered hover>
          <thead className="table-primary">
            <tr>
              <th>Test Name</th>
              <th>Price (৳)</th>
              <th>Date</th>
              <th>Token</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {tests.map((test) => (
              <tr key={test.id}>
                <td>{test.test_name}</td>
                <td>{test.price}</td>
                <td>{test.date}</td>
                <td>{test.token_id || "-"}</td>
                <td>
                  <span
                    className={`badge bg-${
                      test.status === "completed"
                        ? "success"
                        : test.status === "pending"
                        ? "warning"
                        : "danger"
                    }`}
                  >
                    {test.status}
                  </span>
                </td>
               <td>
  {test.token_id && (
    <Button
      variant="success"
      size="sm"
      className="me-2 d-flex align-items-center"
      onClick={() => handleDownload(test)}
    >
      <FaDownload className="me-1" />
      
    </Button>
  )}

  <Button
    variant="danger"
    size="sm"
    className="d-flex align-items-center"
    onClick={() => handleDelete(test.id)}
  >
    <FaTrash className="me-1" />

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

export default Tests;
