import React, { useState } from "react";
import { Modal, Form, Button } from "react-bootstrap";
import { api } from "../../api";

const RegisterModal = ({ show, onHide, roleDefault }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: roleDefault || "patient",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const res = await api.post("/register", formData);
      setSuccess("Registration successful!");
      setFormData({ name: "", email: "", password: "", role: roleDefault || "patient" });
      setTimeout(() => {
        onHide();
      }, 1000);
    } catch (err) {
      if (err.response && err.response.data) {
        setError(err.response.data.message || "Registration failed!");
      } else {
        setError("Something went wrong!");
      }
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Create {roleDefault.charAt(0).toUpperCase() + roleDefault.slice(1)}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <div className="alert alert-danger">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <Form onSubmit={handleRegister}>
          <Form.Group className="mb-3" controlId="name">
            <Form.Label>Full Name</Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="email">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="password">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="role">
            <Form.Label>Role</Form.Label>
            <Form.Select name="role" value={formData.role} onChange={handleChange}>
              <option value="patient">Patient</option>
              <option value="others">Others</option>
              
              
              
            </Form.Select>
          </Form.Group>

          <Button type="submit" variant="success" className="w-100 mt-2">
            Register
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default RegisterModal;
