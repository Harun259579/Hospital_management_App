import React from "react";
import { NavLink } from "react-router-dom";
import { FiHome, FiUser, FiUserPlus, FiDollarSign, FiCalendar, FiFileText } from "react-icons/fi";

const menu = [
  { name: "Dashboard", path: "/patient/dashboard", icon: <FiHome /> },
  { name: "Profile", path: "/patient/profile", icon: <FiUser /> },
  { name: "Doctors", path: "/patient/doctors", icon: <FiUserPlus /> },
  { name: "Appointments", path: "/patient/appointments", icon: <FiCalendar /> },
  { name: "Test", path: "/patient/tests", icon: <FiDollarSign /> },
  { name: "Billing", path: "/patient/billings", icon: <FiDollarSign /> },
  { name: "Medical History", path: "/patient/medical-histories", icon: <FiFileText /> },
];

const PatientSidebar = ({ user }) => {
  return (
    <div className="sidebar p-3 bg-light" style={{ width: "220px", minHeight: "100vh" }}>
      {/* Profile Section */}
      <div className="text-center mb-4">
       {/* <img
          src={user.photo ? `${process.env.REACT_APP_API_URL}/storage/${user.photo}` : "/default-avatar.png"}
          alt="Patient"
          className="img-fluid rounded-circle"
          style={{ width: "80px", height: "80px", objectFit: "cover" }}
        />*/}
        <h5 className="mt-2">{user.name}</h5>
      </div>

      {/* Sidebar Menu */}
      {menu.map((item, i) => (
        <NavLink
          key={i}
          to={item.path}
          className={({ isActive }) =>
            `d-flex justify-content-between align-items-center p-2 mb-2 text-decoration-none sidebar-link ${
              isActive ? "active-link" : "text-dark"
            }`
          }
          style={{
            borderRadius: "6px",
            transition: "all 0.15s ease",
          }}
        >
          <div className="d-flex align-items-center gap-2">
            <span style={{ display: "inline-flex", alignItems: "center" }}>{item.icon}</span>
            <span>{item.name}</span>
          </div>
        </NavLink>
      ))}

      <style>{`
        .sidebar-link:hover {
          background-color: #0d6efd;
          color: #fff !important;
        }

        .active-link {
          background: #0d6efd;
          color: #fff !important;
          position: relative;
        }

        .active-link::before {
          content: "";
          position: absolute;
          left: 0;
          top: 6px;
          bottom: 6px;
          width: 4px;
          background: #0b5ed7;
          border-radius: 2px;
        }

        .sidebar-link svg,
        .active-link svg {
          color: inherit;
        }
      `}</style>
    </div>
  );
};

export default PatientSidebar;
