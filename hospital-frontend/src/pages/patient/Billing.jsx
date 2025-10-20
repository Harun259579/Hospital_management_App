import React, { useEffect, useState } from "react";
import { Table, Spinner, Alert, Button } from "react-bootstrap";
import { api } from "../../api"; // assuming the API module is imported
import classNames from "classnames"; // Import classNames for conditional styling

const PatientBillingPage = () => {
  const [billingData, setBillingData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [patientId, setPatientId] = useState(null);

  // ✅ Fetch the patient profile (which includes patientId)
  useEffect(() => {
    const fetchPatientProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("No token found. Please login again.");
          setLoading(false);
          return;
        }

        // Fetch patient profile
        const res = await api.get("/patient/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Assuming the response contains the patient data including patientId
        setPatientId(res.data.id); // Assuming the patientId is in the 'id' field
      } catch (err) {
        console.error("❌ Failed to fetch patient profile:", err);
        setError("Failed to load patient profile");
        setLoading(false);
      }
    };

    fetchPatientProfile();
  }, []);

  // ✅ Fetch billing data once we have the patientId
  useEffect(() => {
    if (!patientId) return; // Don't fetch billing data until we have patientId

    const fetchBillingData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("No token found. Please login again.");
          setLoading(false);
          return;
        }

        // Fetch patient's billing records
        const res = await api.get(`/patient/${patientId}/billing`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Assuming the response contains a list of billing records
        setBillingData(res.data);
      } catch (err) {
        console.error("❌ Failed to fetch billing data:", err);
        setError("Failed to load billing data");
      } finally {
        setLoading(false);
      }
    };

    fetchBillingData();
  }, [patientId]); // This effect will run when patientId is available

  if (loading)
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" />
        <p>Loading billing records...</p>
      </div>
    );

  if (error) return <Alert variant="danger">{error}</Alert>;

  return (
    <div className="container mt-4">
      <div
        className="card shadow p-4 border-0"
        style={{ borderRadius: "15px", maxWidth: "900px", margin: "0 auto" }}
      >
        <h3 className="fw-bold mb-3">Your Billing Records</h3>

        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>ID</th>
              <th>Amount</th>
              <th>Description</th>
              <th>Status</th>
              <th>Payment Date</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {billingData.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center">
                  No billing records found.
                </td>
              </tr>
            ) : (
              billingData.map((bill) => (
                <tr key={bill.id}>
                  <td>{bill.id}</td>
                  <td>{bill.amount}</td>
                  <td>{bill.cost_description || "N/A"}</td>
                  <td>
                    {/* Conditional class for status */}
                    <span
                      className={classNames({
                        "text-success": bill.status === "Paid",  // Green for Paid
                        "text-danger": bill.status === "Unpaid", // Red for Unpaid
                      })}
                    >
                      {bill.status}
                    </span>
                  </td>
                  <td>{bill.payment_date || "N/A"}</td>
                  <td>
                    <Button variant="outline-primary" size="sm">
                      View Details
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      </div>
    </div>
  );
};

export default PatientBillingPage;
