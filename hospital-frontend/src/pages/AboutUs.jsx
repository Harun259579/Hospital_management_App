import React from "react";
import "../assets/HospitalCards.css";


const AboutUs = () => {
  return (
    <div className="container "style={{marginTop:60}}>
      {/* Page Title */}
      <div className="text-center mb-5">
        <h1 className="display-5 fw-bold text-primary">About Us</h1>
        <p className="lead text-muted">
          Learn more about our hospital, our mission, and our vision for a healthier future.
        </p>
      </div>

      {/* Vision & Mission Section */}
      <div className="row">
        {/* Vision */}
        <div className="col-md-6 mb-4">
          <div className="card shadow-sm border-0 h-100 card-hover">
            <div className="card-body">
              <h3 className="card-title text-info mb-3">Our Vision</h3>
              <p className="card-text text-justify">
                To be the leading healthcare provider in the region, known for excellence in
                patient care, innovation, and compassion. We aim to create a healthier society
                where everyone has access to quality medical services.
              </p>
            </div>
          </div>
        </div>

        {/* Mission */}
        <div className="col-md-6 mb-4">
          <div className="card shadow-sm border-0 h-100 card-hover">
            <div className="card-body">
              <h3 className="card-title text-success mb-3">Our Mission</h3>
              <p className="card-text text-justify">
                Our mission is to deliver patient-centered care with integrity and excellence.
                We strive to combine advanced technology, expert medical professionals, and
                compassion to improve lives and promote well-being in our community.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Extra Section: Our Values */}
      <div className="mt-5 text-center">
        <h3 className="text-primary mb-3">Our Core Values</h3>
        <p className="text-muted mx-auto" style={{ maxWidth: "700px" }}>
          Compassion, Integrity, Innovation, Excellence, and Teamwork are at the heart of
          everything we do. Together, we make healthcare accessible and trustworthy for all.
        </p>
      </div>
    </div>
  );
};

export default AboutUs;
