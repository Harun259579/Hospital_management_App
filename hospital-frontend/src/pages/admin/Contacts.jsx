import React, { useEffect, useState } from "react";
import { Table, Button, Modal, Form, Spinner, Alert } from "react-bootstrap";
import { api } from "../../api";
import { FiMail, FiTrash2 } from "react-icons/fi";

const ContactMessages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState("");

  const fetchMessages = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await api.get("/contact-messages", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessages(res.data.data || []);
    } catch (err) {
      setError("Failed to load messages");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleReply = (message) => {
    setSelectedMessage(message);
    setShowModal(true);
  };

  const sendReply = async () => {
    if (!replyText.trim()) return alert("Please enter a reply message");
    try {
      const token = localStorage.getItem("token");
      await api.post(`/contact-messages/${selectedMessage.id}/reply`, { reply: replyText }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Reply sent successfully!");
      setShowModal(false);
      setReplyText("");
    } catch (err) {
      alert("Failed to send reply");
    }
  };

  const deleteMessage = async (id) => {
    if (!window.confirm("Are you sure to delete this message?")) return;
    try {
      const token = localStorage.getItem("token");
      await api.delete(`/contact-messages/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessages(messages.filter((msg) => msg.id !== id));
    } catch {
      alert("Failed to delete message");
    }
  };

  if (loading) return <Spinner animation="border" className="mt-5" />;

  return (
    <div className="container mt-4">
      <h3>📩 Contact Messages</h3>
      {error && <Alert variant="danger">{error}</Alert>}

      <Table bordered hover className="shadow-sm mt-3">
        <thead className="table-primary">
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Subject</th>
            <th>Message</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {messages.map((msg) => (
            <tr key={msg.id}>
              <td>{msg.id}</td>
              <td>{msg.name}</td>
              <td>{msg.email}</td>
              <td>{msg.subject || "—"}</td>
              <td>{msg.message}</td>
              

            <td>
              <Button
                size="sm"
                variant="outline-success"
                className="me-2"
                onClick={() => handleReply(msg)}
              >
                <FiMail />
              </Button>
              <Button
                size="sm"
                variant="outline-danger"
                onClick={() => deleteMessage(msg.id)}
              >
                <FiTrash2 />
              </Button>
            </td>

            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Reply to {selectedMessage?.email}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Reply Message</Form.Label>
            <Form.Control
              as="textarea"
              rows={4}
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Write your reply here..."
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={sendReply}>
            Send Reply
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ContactMessages;
