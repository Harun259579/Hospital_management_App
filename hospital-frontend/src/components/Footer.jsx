import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-dark text-light py-4 mt-auto">
      <div className="container text-center">
        <p className="mb-1">&copy; {new Date().getFullYear()} Hospital Management</p>
        <p className="mb-0">Phone: +880123456789 | Email: info@hospital.com | Address: Dhaka, Bangladesh</p>
      </div>
    </footer>
  );
};

export default Footer;
