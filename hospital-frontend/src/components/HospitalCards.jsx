import React from "react";
import "../assets/HospitalCards.css";

const HospitalCards = () => {
  const cards = [
    { title: "Emergency Services", desc: "24/7 emergency care available." },
    { title: "Qualified Doctors", desc: "Highly skilled medical professionals." },
    { title: "Advanced Equipment", desc: "State-of-the-art medical technology." },
    { title: "Patient Care", desc: "Compassionate and attentive staff." },
    { title: "Pharmacy", desc: "On-site pharmacy for convenience." },
    { title: "Laboratory", desc: "Accurate and fast diagnostic services." },
    { title: "Radiology", desc: "X-ray, MRI, CT scan and imaging services." },
    { title: "Rehabilitation", desc: "Physical therapy and rehabilitation programs." },
  ];

  return (
    <div className="container my-5">
      <h2 className="text-center text-primary mb-4">Our Hospital Services</h2>
      <div className="row">
        {cards.map((card, idx) => (
          <div key={idx} className="col-md-3 mb-4">
            <div className={`card h-100 shadow-sm card-hover card-color-${idx}`}>
              <div className="card-body text-center">
                <h5 className="card-title">{card.title}</h5>
                <p className="card-text">{card.desc}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HospitalCards;
