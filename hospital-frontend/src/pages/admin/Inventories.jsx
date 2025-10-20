import React, { useEffect, useState } from "react";
import { Table, Spinner, Alert } from "react-bootstrap";
import { api } from "../../api";


const InventoriesPage = () => {
  const [inventories, setInventories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchInventories = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await api.get("/inventories", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setInventories(res.data.data || []);
      } catch (err) {
        console.error(err);
        setError("Failed to load inventory data");
      } finally {
        setLoading(false);
      }
    };

    fetchInventories();
  }, []);

  // Function to check if the expiry date has passed
  const isExpired = (expiryDate) => {
    const currentDate = new Date();
    const expiry = new Date(expiryDate);
    return expiry < currentDate; // If expiry date is before today's date
  };

  if (loading)
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" />
        <p>Loading inventory data...</p>
      </div>
    );

  if (error) return <Alert variant="danger">{error}</Alert>;

  return (
    <div className="container mt-4">
      <h3 className="mb-3">📦 Inventory List</h3>

      {inventories.length === 0 ? (
        <Alert variant="info">No inventory data found</Alert>
      ) : (
        <Table striped bordered hover responsive className="shadow-sm">
          <thead className="table-info">
            <tr>
              <th>ID</th>
              <th>Item Name</th>
              <th>Stock</th>
              <th>Unit</th>
              <th>Expiry Date</th>
              <th>Category</th>
            </tr>
          </thead>
          <tbody>
            {inventories.map((item) => (
              <tr
                key={item.id}
                className={isExpired(item.expiry_date) ? "expired-item" : ""}
              >
                <td>{item.id}</td>
                <td>{item.item_name}</td>
                <td>{item.stock}</td>
                <td>{item.unit}</td>
                <td>{item.expiry_date || "—"}</td>
                <td>{item.category}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  );
};

export default InventoriesPage;
