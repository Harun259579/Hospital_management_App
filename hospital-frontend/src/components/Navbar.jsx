import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Navbar, Nav, Button, Form } from "react-bootstrap";

const AppNavbar = ({ user, onLogout }) => {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    const searchTerm = e.target.value;
    setSearch(searchTerm);

    if (searchTerm.trim()) {
      // Navigate to the doctors page with the search query in the URL
      navigate(`/doctors?search=${searchTerm}`);
    } else {
      // If the search bar is empty, reset to show all doctors
      navigate(`/doctors`);
    }
  };

  return (
    <Navbar bg="light" expand="lg" className="shadow-sm mb-4" fixed="top">
      <Navbar.Brand as={Link} to="/" className="fw-bold text-primary">
        🏥 Adil Specialized Hospital
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="mx-auto align-items-center">
          <Nav.Link as={Link} to="/" className="fw-semibold">
            Home
          </Nav.Link>
          <Nav.Link as={Link} to="/doctors" className="fw-semibold">
            Doctors
          </Nav.Link>
          <Nav.Link as={Link} to="/contact" className="fw-semibold">
            Contact
          </Nav.Link>
          <Nav.Link as={Link} to="/about" className="fw-semibold">
            About Us
          </Nav.Link>
          <Nav.Link as={Link} to="/notices" className="fw-semibold">
            Notice
          </Nav.Link>

          {/* Search Bar */}
          <Form className="d-flex ms-3">
            <Form.Control
              type="search"
              placeholder="Search..."
              className="me-2 rounded-pill px-3"
              value={search}
              onChange={handleSearch}
              style={{ width: "200px" }}
            />
          </Form>
        </Nav>

        {/* Right corner: Login / Logout */}
        <Nav className="me-3 d-flex align-items-center">
          {user ? (
            <Button variant="danger" onClick={onLogout} className="rounded-pill px-3">
              Logout
            </Button>
          ) : (
            <>
              <Button
                as={Link}
                to="/login"
                variant="primary"
                className="me-3 rounded-pill px-3"
              >
                Login
              </Button>
              <Button
                as={Link}
                to="/register"
                variant="outline-primary"
                className="rounded-pill px-3"
              >
                Register
              </Button>
            </>
          )}
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default AppNavbar;
