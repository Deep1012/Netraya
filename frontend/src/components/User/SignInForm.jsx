import './SignInForm.css';
import { FaEnvelope, FaKey } from 'react-icons/fa';
import doctorImage2 from "../../assets/doctorImage2.png";
import logo from '../../assets/logo.png';
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { showToast } from '../ui/Toast';

const SignInForm = ({ setIsLoggedIn }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/users/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (response.ok) {
        showToast('Login successful! Redirecting...', 'success');
        localStorage.setItem('token', data.token);
        setIsLoggedIn(true);

        setTimeout(() => {
          if (data.isNewUser) {
            navigate('/registrationform');
          } else {
            navigate('/');
          }
        }, 1000);
      } else {
        showToast(data.message || 'Invalid credentials. Please try again.', 'error');
      }
    } catch (error) {
      showToast('Network error. Please try again.', 'error');
    }
  };

  return (
    <div className="signin-page">
    <div className="signin-container">
      <div className="logo-container">
        <img src={logo} alt="Netraya Logo" className="logo-top" />
      </div>
      <div className="form-section">
        <h1>Sign In</h1>
        <form onSubmit={handleSubmit}>
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
            <FaKey className="input-icon" />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
            />
          </div>
          <button type="submit" className="submit-button">Sign In</button>
        </form>
        <p className="signup-link"> Don't have an account? <Link to="/signup">Create</Link></p>
      </div>
      <div className="image-section">
        <img src={doctorImage2} alt="Doctor" className="doctor-image" />
      </div>
    </div>
    </div>
  );
};

export default SignInForm;
