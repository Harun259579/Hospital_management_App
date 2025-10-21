import React, { useState } from "react";
import { api } from "../api";


const Contact = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [msg, setMsg] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/contact", form);
      setMsg(res.data.message);
      setForm({ name: "", email: "", subject: "", message: "" });
    } catch (err) {
      setMsg("Something went wrong!");
    }
  };

  return (
    <div className="container" style={{marginTop:60}}>
      <h2 className="text-center text-primary mb-5 mt-2">Contact Us</h2>
      <div className="row">
        {/* ===== LEFT SIDE: Contact Form ===== */}
        <div className="col-md-7">
          <form className="p-4 border rounded bg-light" onSubmit={handleSubmit}>
            <h4 className="mb-4 text-secondary">Send us a Message</h4>

            <div className="form-group mb-3">
              <label>Name</label>
              <input
                name="name"
                className="form-control"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group mb-3">
              <label>Email</label>
              <input
                type="email"
                name="email"
                className="form-control"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group mb-3">
              <label>Subject</label>
              <input
                name="subject"
                className="form-control"
                value={form.subject}
                onChange={handleChange}
              />
            </div>

            <div className="form-group mb-3">
              <label>Message</label>
              <textarea
                name="message"
                className="form-control"
                rows="4"
                value={form.message}
                onChange={handleChange}
                required
              ></textarea>
            </div>

            <button type="submit" className="btn btn-primary w-100">
              Send Message
            </button>

            {msg && <div className="alert alert-info mt-3">{msg}</div>}
          </form>
        </div>

        {/* ===== RIGHT SIDE: Hospital Info ===== */}
        <div className="col-md-5 mt-4 mt-md-0">
          <div className="card border-0 shadow-sm p-4 h-100">
            <h4 className="text-primary mb-3">🏥 Adil Specialized Hospital</h4>
            <p>
              <strong>Address:</strong> 123 Health Avenue, Dhaka, Bangladesh
            </p>
            <p>
              <strong>Phone:</strong> +880 1712 345678
            </p>
            <p>
              <strong>Email:</strong> contact@hospital.com
            </p>
            <hr />
            <h5 className="text-secondary mt-4">🕒 Visiting Hours</h5>
            <p className="mb-1">Mon - Fri: 9:00 AM - 6:00 PM</p>
            <p>Sat - Sun: 10:00 AM - 2:00 PM</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
