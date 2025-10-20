import React, { useState, useEffect } from "react";
import { Form, Button, Alert, Row, Col, Table } from "react-bootstrap";
import { api } from "../../api";

const AddBillingForm = ({ patientId }) => {
  const [patients, setPatients] = useState([]);
  const [formData, setFormData] = useState({
    amount: "",
    cost_description: "",
    status: "unpaid",
    patient_id: patientId || "",
  });
  const [billings, setBillings] = useState([]); // ✅ New: Bill list state
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [totalPaid, setTotalPaid] = useState(0); // Total Paid
  const [totalUnpaid, setTotalUnpaid] = useState(0); // Total Unpaid

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await api.get("/patients");
        const patientsData = response.data.data;
        if (Array.isArray(patientsData)) setPatients(patientsData);
      } catch (err) {
        console.error("Error fetching patients:", err);
      }
    };
    fetchPatients();
  }, []);

  // ✅ Fetch billing data by patient
  const fetchBillings = async (id) => {
    if (!id) return;
    try {
      const res = await api.get(`/billings/patient/${id}`);
      setBillings(res.data.data || []);
      calculateTotal(res.data.data || []); // Recalculate totals
    } catch (err) {
      console.error("Error fetching billings:", err);
    }
  };

  // When patient changes, update billing list
  useEffect(() => {
    if (formData.patient_id) {
      fetchBillings(formData.patient_id);
    }
  }, [formData.patient_id]);

  // Handle input change
  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  // Handle billing submission
  const handleSaveBilling = async (e) => {
    e.preventDefault();
    if (!formData.amount) return setError("Amount is required");

    const token = localStorage.getItem("token");
    const data = { ...formData, patient_id: formData.patient_id || patientId };

    try {
      await api.post("/billings", data, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage("Billing added successfully.");
      setError("");
      setFormData({ amount: "", cost_description: "", status: "unpaid", patient_id: data.patient_id });
      fetchBillings(data.patient_id); // ✅ Refresh list after saving
    } catch (err) {
      console.error("Request failed:", err);
      setError("Failed to add billing.");
    }
  };
   // Handle editing the billing status
  const handleEditBilling = async (billId, newStatus) => {
    const token = localStorage.getItem("token");
    try {
      const response = await api.put(`/billings/${billId}/mark-paid`, 
        { status: newStatus }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage("Billing status updated successfully.");
      setError("");
      fetchBillings(formData.patient_id); // Refresh billings after edit
    } catch (err) {
      console.error("Error updating billing status:", err);
      setError("Failed to update billing status.");
    }
  };


  // ✅ Handle PDF Download (single invoice)
  const handleDownloadInvoice = (billId) => {
    const token = localStorage.getItem("token");
    const pdfUrl = `http://127.0.0.1:8000/api/billings/${billId}/invoice`;

    fetch(pdfUrl, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.blob())
      .then((blob) => {
        const link = document.createElement("a");
        link.href = window.URL.createObjectURL(blob);
        link.download = `invoice-${billId}.pdf`;
        link.click();
      })
      .catch((err) => console.error("PDF download failed:", err));
  };

  // ✅ Handle Print directly from browser
  const handlePrintInvoice = (billId) => {
    const token = localStorage.getItem("token");
    const pdfUrl = `http://127.0.0.1:8000/api/billings/${billId}/invoice`;

    fetch(pdfUrl, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.blob())
      .then((blob) => {
        const pdfUrlObject = window.URL.createObjectURL(blob);
        const newWindow = window.open(pdfUrlObject);

        setTimeout(() => {
          newWindow.print();
        }, 500);
      })
      .catch((err) => console.error("Print failed:", err));
  };

  // Calculate the total paid and unpaid amounts
  const calculateTotal = (billings) => {
    let paid = 0;
    let unpaid = 0;
    billings.forEach((bill) => {
      if (bill.status === "paid") {
        paid += parseFloat(bill.amount);
      } else {
        unpaid += parseFloat(bill.amount);
      }
    });
    setTotalPaid(paid);
    setTotalUnpaid(unpaid);
  };

  // Print the entire page content (including form and billings)
 const handlePrint = () => {
  window.print();
};

  return (
    <div>
      <style>{`
        @media print {
          /* Hide everything by default */
          body * {
            visibility: hidden;
          }
          /* But make printable-content and its descendants visible */
          #printable-content, #printable-content * {
            visibility: visible;
          }
          /* Place printable content at the top-left for printing */
          #printable-content {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
          /* Hide buttons inside printable-content if you want using .no-print */
          .no-print {
            display: none !important;
          }
        }
      `}</style>

      <h3>Add Billing Information</h3>

      {error && <Alert variant="danger">{error}</Alert>}
      {message && <Alert variant="success">{message}</Alert>}

      {/* --- Billing Form --- */}
      <Form onSubmit={handleSaveBilling}>
        <Row>
          <Col md={6}>
            <Form.Group controlId="amount">
              <Form.Label>Amount</Form.Label>
              <Form.Control
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                placeholder="Enter amount"
                required
              />
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group controlId="costDescription">
              <Form.Label>Cost Description</Form.Label>
              <Form.Control
                type="text"
                name="cost_description"
                value={formData.cost_description}
                onChange={handleChange}
                placeholder="Enter cost description (optional)"
              />
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col md={6}>
            <Form.Group controlId="status">
              <Form.Label>Status</Form.Label>
              <Form.Control
                as="select"
                name="status"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="unpaid">Unpaid</option>
                <option value="paid">Paid</option>
              </Form.Control>
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group controlId="patient">
              <Form.Label>Patient</Form.Label>
              <Form.Control
                as="select"
                name="patient_id"
                value={formData.patient_id}
                onChange={handleChange}
                required
              >
                <option value="">Select Patient</option>
                {patients.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.user?.name || p.name}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
          </Col>
        </Row>

        <Button variant="primary" type="submit" style={{ marginTop: 10 }}>
          Save Billing
        </Button>
      </Form>

      {/* --- Billing List --- */}
      {billings.length > 0 && (
        <div style={{ marginTop: 30 }}  id="printable-content">
          <h4>Patient Billing History</h4>
          <Table bordered hover>
            <thead>
              <tr>
                <th>#</th>
                <th>Amount</th>
                <th>Description</th>
                <th>Status</th>
                <th>Payment Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {billings.map((bill, i) => (
                <tr key={bill.id}>
                  <td>{i + 1}</td>
                  <td>{bill.amount}</td>
                  <td>{bill.cost_description || "-"}</td>
                  <td
                    style={{
                      color: bill.status === "paid" ? "green" : "red",
                      fontWeight: "bold",
                    }}
                  >
                    {bill.status}
                  </td>
                  <td>{bill.payment_date || "-"}</td>
                  <td>
                     {bill.status === "unpaid" && (
                      <Button
                        size="sm"
                        variant="warning"
                        onClick={() => handleEditBilling(bill.id, "paid")}
                      >
                        Mark as Paid
                      </Button>
                    )}
                    {/*<Button
                      size="sm"
                      variant="secondary"
                      className="me-2"
                      onClick={() => handleDownloadInvoice(bill.id)}
                    >
                      Download PDF
                    </Button>
*/}
                    <Button
                      size="sm"
                      variant="success"
                      onClick={() => handlePrintInvoice(bill.id)}
                    >
                      Print
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>

          {/* --- Total Summary --- */}
          <div style={{ marginTop: 20 }}>
            <h5>Total Summary</h5>
            <p><strong>Total Paid:</strong> {totalPaid}</p>
            <p><strong>Total Due:</strong> {totalUnpaid}</p>
          </div>

          {/* Print Button */}
          <Button variant="info" onClick={handlePrint} style={{ marginTop: 20 }}>
            Print All
          </Button>
        </div>
      )}
    </div>
  );
};

export default AddBillingForm;
