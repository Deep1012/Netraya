import './SignUpForm.css';
import { FaUser, FaEnvelope, FaLock } from 'react-icons/fa';
import doctorImage1 from '../../assets/doctorImage1.png';
import logo from '../../assets/logo.png';
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { showToast } from '../ui/Toast';

const SignUpForm = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });
  const navigate = useNavigate(); // Initialize useNavigate

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/users/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (response.ok) {
        showToast(data.message || 'Account created successfully!', 'success');
        setTimeout(() => navigate('/signin'), 1200);
      } else {
        showToast(data.message || 'Signup failed. Please try again.', 'error');
      }
    } catch (error) {
      showToast('Network error. Please try again.', 'error');
    }
  };

  return (
    <div className="signup-page">
    <div className="signup-container">
      <div className="logo-container">
        <img src={logo} alt="Netraya Logo" className="logo-top" />
      </div>
      <div className="form-section">
        <h1>Hi there, ....</h1>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <FaUser className="input-icon" />
            <input
              type="text"
              name="username"
              placeholder="Full name"
              value={formData.username}
              onChange={handleChange}
            />
          </div>
          <div className="input-group">
            <FaEnvelope className="input-icon" />
            <input
              type="email"
              name="email"
              placeholder="Email address"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
          <div className="input-group">
            <FaLock className="input-icon" />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
            />
          </div>
          <button type="submit" className="submit-button">Get Started</button>
        </form>
        
        {/* Sign In link below the form */}
        <p className="signin-link">
          Already have an account? <Link to="/signin">Sign In</Link>
        </p>
      </div>
      <div className="image-section">
        <img src={doctorImage1} alt="Doctor" className="doctor-image" />
      </div>
    </div>
    </div>
  );
};

export default SignUpForm;
