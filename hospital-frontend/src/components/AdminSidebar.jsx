import { FiChevronRight } from "react-icons/fi";
import {
  FiHome,
  FiUser,
  FiUsers,
  FiUserPlus,
  FiUserCheck,
  FiUserX,
  FiCalendar,
  FiBox,
  FiMail,
  FiFileText,
  FiDollarSign,
  FiBarChart2,
} from "react-icons/fi";
import { NavLink } from "react-router-dom";

const menu = [
  { name: "Dashboard", path: "/admin/dashboard", icon: <FiHome /> },
  { name: "Profile", path: "/admin/profile", icon: <FiUser /> },
  { name: "Doctors", path: "/admin/doctors", icon: <FiUserPlus /> },
  { name: "Nurses", path: "/admin/nurses", icon: <FiUserCheck /> },
  { name: "Staff", path: "/admin/staffs", icon: <FiUsers /> },
  { name: "Notice", path: "/admin/notices/create", icon: <FiCalendar /> },
  { name: "TestName", path: "/admin/testnames", icon: <FiCalendar /> },
  { name: "Message", path: "/admin/contact", icon: <FiMail /> },
  { name: "Patients", path: "/admin/patients", icon: <FiUserX /> },
  { name: "Appointments", path: "/admin/appointments", icon: <FiCalendar /> },
  { name: "Inventory", path: "/admin/inventory", icon: <FiBox /> },
  { name: "MedicalHistory", path: "/admin/medical-histories", icon: <FiFileText /> },
  { name: "Billing", path: "/admin/billings", icon: <FiDollarSign /> },
  { name: "Reports", path: "/admin/reports", icon: <FiBarChart2 /> },
];

const AdminSidebar = ({ adminPhoto, adminName }) => {
  return (
    <div
      className="sidebar p-3 bg-light"
      style={{ width: "220px", minHeight: "100vh" }}
    >
      {/* Admin Photo and Name Section */}
      <div className="text-center mb-4">
     {/*   <img
          src={adminPhoto} // Assuming `adminPhoto` is a URL to the image
          alt="Admin"
          style={{
            width: "60px",
            height: "60px",
            borderRadius: "50%",
            objectFit: "cover",
          }}
        />*/}
        <h5 className="mt-2">{adminName}</h5>
      </div>
      
      {/* Sidebar Menu */}
      {menu.map((item, idx) => (
        <NavLink
          key={idx}
          to={item.path}
          className={({ isActive }) =>
            `d-flex justify-content-between align-items-center p-2 mb-2 text-decoration-none sidebar-link ${
              isActive ? "bg-primary text-white" : "text-dark"
            }`
          }
          style={{
            borderRadius: "5px",
            transition: "all 0.2s ease",
          }}
        >
          <div className="d-flex align-items-center gap-2">
            {item.icon}
            <span>{item.name}</span>
          </div>
          <FiChevronRight />
        </NavLink>
      ))}

      {/* Inline hover style */}
      <style>{`
        .sidebar-link:hover {
          background-color: #0d6efd;
          color: white !important;
        }
      `}</style>
    </div>
  );
};

export default AdminSidebar;
