import React, { useState, useEffect } from "react";
import { Table, Spinner, Alert, Form } from "react-bootstrap";
import { api } from "../../api";

const ReportsPage = () => {
  const [reportType, setReportType] = useState(""); // 🔹 Start with empty
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchReport = async (type) => {
    if (!type) return; // ✅ No fetch until user selects something
    setLoading(true);
    setError("");
    setData([]);

    try {
      const token = localStorage.getItem("token");
      const res = await api.get(`/reports/${type}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const result = Array.isArray(res.data) ? res.data : [res.data];
      setData(result);
    } catch (err) {
      console.error(err);
      setError("Failed to load report data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (reportType) {
      fetchReport(reportType);
    }
  }, [reportType]);

  const renderBillTable = (title, rows, color) => {
    const totalAmount = rows.reduce((sum, r) => sum + parseFloat(r.amount || 0), 0);

    return (
      <div className="mb-4">
        <h5 className="mt-4">{title}</h5>
        <Table striped bordered hover responsive>
          <thead className={color}>
            <tr>
              <th>Patient ID</th>
              <th>Amount</th>
              <th>Cost Description</th>
              <th>Status</th>
              <th>Payment Date</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i}>
                <td>{row.patient_id}</td>
                <td>{row.amount}</td>
                <td>{row.cost_description || "—"}</td>
                <td>{row.status}</td>
                <td>{row.payment_date || "—"}</td>
              </tr>
            ))}
            {rows.length > 0 && (
              <tr className="fw-bold">
                <td colSpan={5} className="text-end">
                  Total Amount: {totalAmount.toFixed(2)}
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>
    );
  };

  const renderReportTables = () => {
    const paidData = data.filter((row) => row.status === "paid");
    const unpaidData = data.filter((row) => row.status === "unpaid");

    return (
      <>
        {renderBillTable("💰 Paid Bills", paidData, "table-success")}
        {renderBillTable("❌ Unpaid Bills", unpaidData, "table-danger")}
      </>
    );
  };

  const renderTable = () => {
    if (
      reportType === "daily-income" ||
      reportType === "monthly-income" ||
      reportType === "yearly-income"
    ) {
      return renderReportTables();
    }

    if (reportType === "doctor-earnings") {
      return (
        <Table striped bordered hover responsive>
          <thead className="table-warning">
            <tr>
              <th>Doctor Name</th>
              <th>Total Earnings</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, i) => (
              <tr key={i}>
                <td>{row.doctor_name}</td>
                <td>{row.total_earnings}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      );
    }

    if (reportType === "appointments") {
      return (
        <Table striped bordered hover responsive>
          <thead className="table-info">
            <tr>
              <th>Date</th>
              <th>Total Appointments</th>
              <th>Completed</th>
              <th>Pending</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, i) => (
              <tr key={i}>
                <td>{row.date}</td>
                <td>{row.total_appointments}</td>
                <td>{row.completed}</td>
                <td>{row.pending}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      );
    }
  };

  return (
    <div className="container mt-4">
      <h3 className="mb-3">📊 Billings Reports</h3>

      <Form.Group className="mb-3" controlId="reportType">
        <Form.Label>Select Report Type</Form.Label>
        <Form.Select
          value={reportType}
          onChange={(e) => setReportType(e.target.value)}
        >
          <option value="">-- Select Report Type --</option>
          <option value="daily-income">🗓 Daily Income Report</option>
          <option value="monthly-income">📆 Monthly Income Report</option>
          <option value="yearly-income">📅 Yearly Income Report</option>
        
        </Form.Select>
      </Form.Group>

      {/* ✅ Blank screen initially */}
      {!reportType && (
        <Alert variant="secondary" className="text-center">
          Please select a report type to view data.
        </Alert>
      )}

      {loading && (
        <div className="text-center mt-4">
          <Spinner animation="border" />
          <p>Loading report data...</p>
        </div>
      )}

      {error && <Alert variant="danger">{error}</Alert>}

      {!loading && !error && reportType && data.length > 0 && renderTable()}

      {!loading && !error && reportType && data.length === 0 && (
        <Alert variant="info">No report data found</Alert>
      )}
    </div>
  );
};

export default ReportsPage;
