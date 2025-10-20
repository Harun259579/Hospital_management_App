import React from "react";

const NurseNavbar = ({ user, onLogout, onToggleSidebar }) => {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light shadow-sm px-3">
      <div className="container-fluid d-flex justify-content-between align-items-center">
        
        {/* Sidebar toggle button */}
        <button
          className="btn btn-outline-primary me-2"
          onClick={onToggleSidebar}
        >
          <i className="bi bi-list"></i>
        </button>

       

        {/* Right side user info */}
        <div className="d-flex align-items-center">
          {user && (
            <>
              <span className="me-3 fw-semibold">
                👤 {user.name} ({user.role})
              </span>
              <button
                onClick={onLogout}
                className="btn btn-sm btn-danger"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default NurseNavbar;
