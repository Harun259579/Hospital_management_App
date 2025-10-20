import React, { useState, useEffect } from "react";
import { Table, Spinner, Alert, Form } from "react-bootstrap";
import { api } from "../../api";

const ReportsPage = () => {
  const [reportType, setReportType] = useState("daily-income");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchReport = async (type) => {
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
    fetchReport(reportType);
  }, [reportType]);

  const renderTable = () => {
    if (reportType === "daily-income") {
      return (
        <Table striped bordered hover responsive>
          <thead className="table-primary">
            <tr>
              <th>Date</th>
              <th>Total Income</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, i) => (
              <tr key={i}>
                <td>{row.date}</td>
                <td>{row.total_income}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      );
    }

    if (reportType === "monthly-income") {
      return (
        <Table striped bordered hover responsive>
          <thead className="table-success">
            <tr>
              <th>Month</th>
              <th>Total Income</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, i) => (
              <tr key={i}>
                <td>{row.month}</td>
                <td>{row.total_income}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      );
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
      <h3 className="mb-3">📊 Reports</h3>

      <Form.Group className="mb-3" controlId="reportType">
        <Form.Label>Select Report Type</Form.Label>
        <Form.Select
          value={reportType}
          onChange={(e) => setReportType(e.target.value)}
        >
          <option value="daily-income">🗓 Daily Income Report</option>
          <option value="monthly-income">📆 Monthly Income Report</option>
          <option value="doctor-earnings">👨‍⚕️ Doctor Earnings</option>
          <option value="appointments">📋 Appointment Report</option>
        </Form.Select>
      </Form.Group>

      {loading && (
        <div className="text-center mt-4">
          <Spinner animation="border" />
          <p>Loading report data...</p>
        </div>
      )}

      {error && <Alert variant="danger">{error}</Alert>}

      {!loading && !error && data.length > 0 && renderTable()}

      {!loading && !error && data.length === 0 && (
        <Alert variant="info">No report data found</Alert>
      )}
    </div>
  );
};

export default ReportsPage;
