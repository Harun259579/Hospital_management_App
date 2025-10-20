import React from "react";
import { Link } from "react-router-dom";
import { Carousel, Card, Row, Col, Container } from "react-bootstrap";
import HospitalCards from "../components/HospitalCards";
import AppNavbar from "../components/Navbar";

const Home = ({ user, onLogout }) => {
  return (
    <>
   {/*Slider Start */}
       <Carousel fade prevLabel="" nextLabel="">
        <Carousel.Item>
          <img
            className="d-block w-100"
            src="/images/slide11.jpg"
            alt="First slide"
            style={{ height: "90vh", objectFit: "cover" }}
          />
          <Carousel.Caption>
            <h3>Welcome to Our Hospital</h3>
            <p>Your health, our priority.</p>
          </Carousel.Caption>
        </Carousel.Item>

        <Carousel.Item>
          <img
            className="d-block w-100"
            src="/images/slide2.jpg"
            alt="Second slide"
            style={{ height: "90vh", objectFit: "cover" }}
          />
          <Carousel.Caption>
            <h3>Expert Doctors</h3>
            <p>We provide world-class medical services.</p>
          </Carousel.Caption>
        </Carousel.Item>

        <Carousel.Item>
          <img
            className="d-block w-100"
            src="/images/slide3.jpg"
            alt="Third slide"
            style={{ height: "90vh", objectFit: "cover" }}
          />
          <Carousel.Caption>
            <h3>Modern Facilities</h3>
            <p>Advanced technology for better treatment.</p>
          </Carousel.Caption>
        </Carousel.Item>

        <Carousel.Item>
          <img
            className="d-block w-100"
            src="/images/slide4.jpg"
            alt="Fourth slide"
            style={{ height: "90vh", objectFit: "cover" }}
          />
          <Carousel.Caption>
            <h3>Accurate Testing</h3>
            <p>State-of-the-art laboratories ensuring reliable results.</p>
          </Carousel.Caption>
        </Carousel.Item>

        <Carousel.Item>
          <img
            className="d-block w-100"
            src="/images/slide5.jpg"
            alt="Fifth slide"
            style={{ height: "90vh", objectFit: "cover" }}
          />
          <Carousel.Caption>
            <h3>Customer Satisfaction</h3>
            <p>We care about your comfort and well-being.</p>
          </Carousel.Caption>
        </Carousel.Item>
      </Carousel>

       {/* Info Section */}
      <section className="py-5 ">
        
          <Row className="align-items-center">
            {/* Left side - Text */}
            
            <Col md={7}>
            <div
             style={{
                  backgroundColor: "rgba(0, 123, 255, 0.1)",
                  padding: "30px",
                  borderRadius: "10px",
                }}>
              <h2 className="text-primary fw-bold mb-3">Welcome to Adil Specialized Hospital.</h2>
              <p className="text-justify mb-4">
                On 27 June 2020, Dr. Md. Abir Roy, Managing Director coordinated and organized about 50 distinguished physicians and Surgeons of the Country and started a Hospital to provide specialized health care services to all types of patients especially poor patients in the private sector named Adil Specialized Hospital Ltd. It is an International Standard well equipped Multi-Disciplinary hospital in Bangladesh that has been working with the maximum number of eminent own physicians and surgeons in the country. We are confidently providing comprehensive health care service to the patients with the latest Medical, Surgical, Diagnostic, and Blood Transfusion facilities by expert medical professionals, skilled nurses, and technologists using state-of-the-art technology.
              </p>
            
              </div>
            </Col>


            {/* Right side - Image */}
           <Col md={5} className="text-center">
  {/* Ambulance Image */}
  <img
    src="/images/ambuilance.jpg"
    alt="Ambulance"
    className="img-fluid rounded shadow"
    style={{ width: "100%", maxWidth: "450px", borderRadius: "10px" }}
  />

  {/* Text Section */}
  <div
    style={{
      backgroundColor: "#28a745", // Green background
      color: "white",
      padding: "15px 10px",
      borderRadius: "0 0 10px 10px",
      marginTop: "-5px",
      boxShadow: "0 3px 8px rgba(0,0,0,0.2)",
    }}
  >
    <h5
      className="fw-bold ambulance-blink"
      style={{
        margin: 0,
        fontWeight: "700",
        letterSpacing: "1px",
      }}
    >
     Ambulance Service -24/7
    </h5>
    <h4 className="fw-bold mb-2">
      📞 Call Now: <span className="text-light">+880 1700-123456</span>
    </h4>
    
  </div>
</Col>
          </Row>
        
      </section>
     
    <HospitalCards />

     
    </>
  );
};

export default Home;
