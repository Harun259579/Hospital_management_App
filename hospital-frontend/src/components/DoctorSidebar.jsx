import React from "react";
import { NavLink } from "react-router-dom";
import {
  FiHome,
  FiUser,
  FiUsers,
  FiUserCheck,
  FiUserPlus,
  FiFileText,
  FiChevronRight,
  FiCalendar,
} from "react-icons/fi";
import { assetBase } from "../api";

const menu = [
  { name: "Dashboard", path: "/doctor/dashboard", icon: <FiHome /> },
  { name: "Profile", path: "/doctor/profile", icon: <FiUser /> },
  { name: "Doctors", path: "/doctor/doctors", icon: <FiUserPlus /> },
  { name: "Nurses", path: "/doctor/nurses", icon: <FiUserCheck /> },
  { name: "Patients", path: "/doctor/patients", icon: <FiUsers /> },
  { name: "Shedules", path: "/doctor/doctor-shedules", icon: <FiCalendar /> },
  { name: "Appointments", path: "/doctor/appointments", icon: <FiCalendar /> },
  { name: "Medical History", path: "/doctor/medical-histories", icon: <FiFileText /> },
];

const DoctorSidebar = ({ doctorPhoto, doctorName }) => {
  const photoUrl = doctorPhoto
  ? doctorPhoto.startsWith("http")
    ? doctorPhoto
    : `${assetBase}${doctorPhoto.startsWith("/") ? doctorPhoto : "/" + doctorPhoto}`
  : "/default-avatar.png";

  console.log("🧩 Sidebar Photo URL:", photoUrl);

  return (
    <div className="sidebar p-3 bg-light" style={{ width: "220px", minHeight: "100vh" }}>
      <div className="d-flex flex-column align-items-center mb-4">
       {/* <img
          src={photoUrl}
          alt="Doctor Profile"
          style={{
            width: "80px",
            height: "80px",
            borderRadius: "50px",
            objectFit: "cover",
            marginBottom: "10px",
            boxShadow: "0 0 6px rgba(0,0,0,0.1)",
          }}
        />*/}
        <h6 className="text-center">{doctorName || "Doctor"}</h6>
      </div>

      {menu.map((item, i) => (
        <NavLink
          key={i}
          to={item.path}
          end
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
            <span>{item.icon}</span>
            <span>{item.name}</span>
          </div>

          <FiChevronRight />
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

export default DoctorSidebar;
