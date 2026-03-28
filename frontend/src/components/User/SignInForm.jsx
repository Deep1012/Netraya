import './SignInForm.css';
import { FaEnvelope, FaKey } from 'react-icons/fa';
import doctorImage2 from "../../assets/doctorImage2.png"; 
import logo from '../../assets/logo.png';
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

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
        alert(data.message); // Show success message
        localStorage.setItem('token', data.token); // Store token in local storage
        setIsLoggedIn(true); // Set login state to true

        // Check if the user is new and redirect accordingly
        if (data.isNewUser) {
          navigate('/registrationform'); // Redirect to RegistrationForm if user is new
        } else {
          navigate('/'); // Redirect to the landing page if user is not new
        }
      } else {
        alert(data.message); // Show error message
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
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
  );
};

export default SignInForm;
