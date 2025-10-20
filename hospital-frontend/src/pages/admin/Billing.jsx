import React, { useEffect, useState } from "react";
import { Table, Spinner, Alert, Row, Col } from "react-bootstrap";
import { api } from "../../api";

const BillingPage = () => {
  const [billings, setBillings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [totalPaid, setTotalPaid] = useState(0); // State for total paid
  const [totalDue, setTotalDue] = useState(0);   // State for total due

  useEffect(() => {
    const fetchBillings = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await api.get("/billings", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const billingData = res.data.data || res.data;
        setBillings(billingData);

        // Calculate total paid and total due
        let paid = 0;
        let due = 0;

        billingData.forEach((bill) => {
          if (bill.status === "paid") {
            paid += parseFloat(bill.amount);
          } else {
            due += parseFloat(bill.amount);
          }
        });

        // Set the calculated totals
        setTotalPaid(paid);
        setTotalDue(due);
      } catch (err) {
        console.error(err);
        setError("Failed to load billing data");
      } finally {
        setLoading(false);
      }
    };

    fetchBillings();
  }, []);

  if (loading)
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" />
        <p>Loading billing data...</p>
      </div>
    );

  if (error) return <Alert variant="danger">{error}</Alert>;

  return (
    <div className="container mt-4">
      <h3 className="mb-3">💰 Billing Records</h3>

      {/* Display the total summary */}
      <Row className="mb-3">
        <Col md={6}>
          <Alert variant="info">
            <strong>Total Paid:</strong> ${totalPaid.toFixed(2)}
          </Alert>
        </Col>
        <Col md={6}>
          <Alert variant="warning">
            <strong>Total Due:</strong> ${totalDue.toFixed(2)}
          </Alert>
        </Col>
      </Row>

      {billings.length === 0 ? (
        <Alert variant="info">No billing records found</Alert>
      ) : (
        <Table striped bordered hover responsive className="shadow-sm">
          <thead className="table-warning">
            <tr>
              <th>ID</th>
              <th>Patient ID</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Payment Date</th>
            </tr>
          </thead>
          <tbody>
            {billings.map((bill) => (
              <tr key={bill.id}>
                <td>{bill.id}</td>
                <td>{bill.patient_id}</td>
                <td>${bill.amount}</td>
                <td
                  style={{
                    color: bill.status === "paid" ? "green" : "red",
                    fontWeight: "bold",
                  }}
                >
                  {bill.status}
                </td>
                <td>{bill.payment_date || "—"}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  );
};

export default BillingPage;
