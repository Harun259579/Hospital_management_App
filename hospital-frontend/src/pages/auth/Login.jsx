import React, { useState } from 'react';
import { api } from "../../api";
import { useNavigate } from 'react-router-dom';
import { Form, Button, Card, Container } from 'react-bootstrap';

const Login = ({ onLogin }) => {
const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
  e.preventDefault();
  try {
    const res = await api.post("/login", { email, password });
    localStorage.setItem("token", res.data.token);
    console.log("Login response:", res.data);
    onLogin(res.data.user); 

    const role = res.data.user?.role;
    if (role === "admin") navigate("/admin");
    else if (role === "doctor") navigate("/doctor");
    else if (role === "nurse") navigate("/nurse");
    else if (role === "staff") navigate("/staff");
    else if (role === "patient") navigate("/patient");
    else navigate("/");
  } catch (err) {
    console.error(err);
    setError("Invalid credentials!");
  }
};
  return (
    <Container className="d-flex justify-content-center align-items-center vh-100 ">
      <Card style={{ width: '25rem' }}>
        <Card.Body>
          <h4 className="text-center mb-3">Login</h4>
          {error && <div className="alert alert-danger">{error}</div>}
          <Form onSubmit={handleLogin}>
            <Form.Group controlId="email">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </Form.Group>
            <Form.Group controlId="password" className="mt-3">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </Form.Group>
            <Button className="w-100 mt-3" variant="primary" type="submit">
              Login
            </Button>
          </Form>
          <div className="text-center mt-3">
            <small>
              If You Dont have an account?{" "}
              <a href="/register" className="text-primary">
                Register here
              </a>
            </small>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Login;
