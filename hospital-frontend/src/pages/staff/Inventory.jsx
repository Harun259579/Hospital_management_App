import React, { useState, useEffect } from "react";
import { Form, Button, Alert, Row, Col, Table } from "react-bootstrap";
import { api } from "../../api";


const AddInventoryForm = () => {
  const [formData, setFormData] = useState({
    item_name: "",
    stock: "",
    unit: "",
    expiry_date: "",
    category: "",
  });
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [inventoryItems, setInventoryItems] = useState([]); // State to hold inventory items

  // Fetch inventory items when the component mounts
  useEffect(() => {
    fetchInventoryItems();
  }, []);

  // Function to fetch inventory items from API
  const fetchInventoryItems = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await api.get("/inventories", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setInventoryItems(response.data.data); // Update state with fetched data
    } catch (err) {
      console.error("Error fetching inventory items:", err);
      setError("Failed to fetch inventory items.");
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    try {
      // Send POST request to add new inventory item
      await api.post("/inventories", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage("Item added successfully.");
      setError("");

      // Reset the form data
      setFormData({ item_name: "", stock: "", unit: "", expiry_date: "", category: "" });

      // Fetch updated inventory list after adding the new item
      fetchInventoryItems();
    } catch (err) {
      console.error("Request failed:", err);
      setError("Failed to add inventory item.");
    }
  };

  // Function to check if expiry date is in the past
  const isExpired = (expiryDate) => {
    const currentDate = new Date();
    const expiry = new Date(expiryDate);
    return expiry < currentDate; // If expiry date is before today's date
  };

  return (
    <div>
      <h3>Add Inventory Item</h3>

      {error && <Alert variant="danger">{error}</Alert>}
      {message && <Alert variant="success">{message}</Alert>}

      {/* Inventory Item Form */}
      <Form onSubmit={handleSubmit}>
        {/* First Row with 2 Fields */}
        <Row>
          <Col md={6}>
            <Form.Group controlId="item_name">
              <Form.Label>Item Name</Form.Label>
              <Form.Control
                type="text"
                name="item_name"
                value={formData.item_name}
                onChange={handleChange}
                placeholder="Enter item name"
                required
              />
            </Form.Group>
          </Col>
          
          <Col md={6}>
            <Form.Group controlId="stock">
              <Form.Label>Stock</Form.Label>
              <Form.Control
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                placeholder="Enter stock quantity"
                required
              />
            </Form.Group>
          </Col>
        </Row>

        {/* Second Row with 2 Fields */}
        <Row>
          <Col md={6}>
            <Form.Group controlId="unit">
              <Form.Label>Unit</Form.Label>
              <Form.Control
                type="text"
                name="unit"
                value={formData.unit}
                onChange={handleChange}
                placeholder="Enter unit (e.g., kg, pcs)"
              />
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group controlId="expiry_date">
              <Form.Label>Expiry Date</Form.Label>
              <Form.Control
                type="date"
                name="expiry_date"
                value={formData.expiry_date}
                onChange={handleChange}
                placeholder="Enter expiry date"
              />
            </Form.Group>
          </Col>
        </Row>

        {/* Third Row with 1 Field */}
        <Row>
          <Col md={12}>
            <Form.Group controlId="category">
              <Form.Label>Category</Form.Label>
              <Form.Control
                type="text"
                name="category"
                value={formData.category}
                onChange={handleChange}
                placeholder="Enter category"
              />
            </Form.Group>
          </Col>
        </Row>

        <Button variant="primary" type="submit">
          Save Item
        </Button>
      </Form>

      {/* Display Inventory Items Table */}
      <div style={{ marginTop: 30 }}>
        <h4>Inventory List</h4>
        <Table bordered hover>
          <thead>
            <tr>
              <th>#</th>
              <th>Item Name</th>
              <th>Stock</th>
              <th>Unit</th>
              <th>Expiry Date</th>
              <th>Category</th>
            </tr>
          </thead>
          <tbody>
            {inventoryItems.length > 0 ? (
              inventoryItems.map((item, i) => (
                <tr
                  key={item.id}
                  className={isExpired(item.expiry_date) ? "expired-item" : ""}
                >
                  <td>{i + 1}</td>
                  <td>{item.item_name}</td>
                  <td>{item.stock}</td>
                  <td>{item.unit}</td>
                  <td>{item.expiry_date || "-"}</td>
                  <td>{item.category || "-"}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center">
                  No items available.
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>
    </div>
  );
};

export default AddInventoryForm;
