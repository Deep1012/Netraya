import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import './Services.css';
import serviceIcon from '/src/assets/serviceIcon.png';
import DemoRequestForm from "./DemoRequestForm";

const Services = ({ isLoggedIn }) => {
  const navigate = useNavigate();
  const [isDemoOpen, setIsDemoOpen] = useState(false);

  const handleStartAnalysis = () => {
    if (!isLoggedIn) {
      navigate("/signup");
    } else {
      navigate("/servicespage");
    }
  };

  return (
    <section id="services" className="services">
      <h2>Our Services</h2>
      <div className="service-cards">
        {/* Left Card - AI Analysis */}
        <div className="service-card-wrapper" onClick={handleStartAnalysis} style={{ cursor: 'pointer' }}>
          <div className="service-card">
            <img src={serviceIcon} alt="Service Icon" className="service-icon" />
            <h3>AI-Powered Retinal Analysis</h3>
            <p>Upload retinal images and get instant AI-powered diabetic retinopathy detection with detailed severity grading.</p>
          </div>
          <div className="service-actions">
            <button
              className="service-btn-primary"
              onClick={(e) => {
                e.stopPropagation();
                handleStartAnalysis();
              }}
            >
              {isLoggedIn ? "Start Analysis" : "Sign Up to Start"}
            </button>
            <a
              href="https://www.perlego.com/book/1011064/handbook-of-retinal-screening-in-diabetes-diagnosis-and-management-pdf"
              className="service-btn-secondary"
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
            >
              Learn More
            </a>
          </div>
        </div>

        {/* Right Card */}
        <div className="service-card-wrapper">
          <div className="service-card">
            <img src={serviceIcon} alt="Service Icon" className="service-icon" />
            <h3>Request a Demo to Experience Our Solutions</h3>
            <p>See how our innovative tool can transform your practice with a personalized walkthrough.</p>
          </div>
          <div className="service-actions">
            <button onClick={() => setIsDemoOpen(true)} className="service-btn-outline">
              Request Demo
            </button>
          </div>
          <div className="service-actions">
            <button onClick={() => setIsDemoOpen(true)} className="service-btn">
              Request Demo
            </button>
          </div>
        </div>
      </div>

      <DemoRequestForm 
        isOpen={isDemoOpen}
        onClose={() => setIsDemoOpen(false)}
      />
    </section>
  );
};

export default Services;
