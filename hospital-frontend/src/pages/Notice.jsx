import React, { useEffect, useState } from "react";
import { api } from "../api";
import {
  Container,
  Table,
  Button,
  Modal,
  Alert,
} from "react-bootstrap";

const NoticeBoard = () => {
  const [notices, setNotices] = useState([]);
  const [showModal, setShowModal] = useState(false); // To control modal visibility
  const [selectedNotice, setSelectedNotice] = useState(null); // To store selected notice for details

  // Fetch notices from the API
  useEffect(() => {
    const fetchNotices = async () => {
      try {
        const res = await api.get("/notices");
        setNotices(res.data);
      } catch (err) {
        console.error("Failed to load notices:", err);
      }
    };
    fetchNotices();
  }, []);

  // Open the modal with details of the clicked notice
  const handleShowDetails = (notice) => {
    setSelectedNotice(notice);
    setShowModal(true);
  };

  // Close the modal
  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedNotice(null);
  };

  return (
    <Container style={{marginTop:60}}>
      <h4 className="text-primary mb-3 text-center">Notice Board</h4>

      {/* Table displaying notices */}
      <Table striped bordered hover responsive style={{marginBottom:250}}>
        <thead>
          <tr className="text-center">
           
            <th>Title</th>
            <th>Notice</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {notices.length > 0 ? (
            notices.map((n) => (
              <tr key={n.id}>
                
                <td>{n.title}</td>
                <td>{n.message.slice(0, 50)}...</td> {/* Showing part of the message */}
                <td className="text-center">
                  <Button variant="info" onClick={() => handleShowDetails(n)}>
                    View Details
                  </Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="text-center text-muted">
                No active notices right now.
              </td>
            </tr>
          )}
        </tbody>
      </Table>

      {/* Modal for displaying notice details */}
      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Notice Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedNotice ? (
            <>
              <h5>{selectedNotice.title}</h5>
              <p>{selectedNotice.message}</p>
            </>
          ) : (
            <Alert variant="danger">No notice details available.</Alert>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default NoticeBoard;
