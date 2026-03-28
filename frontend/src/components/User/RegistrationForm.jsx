import './RegistrationForm.css';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for redirection
import { FaEnvelope, FaPhone, FaCalendarAlt, FaUpload, FaUser, FaMapMarkerAlt } from 'react-icons/fa';
import logo from '../../assets/logo.png';

const RegistrationForm = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    dob: '',
    gender: '',
    address: '',
    specialization: '',
    licenseNumber: '',
    practiceLength: '',
    affiliation: '',
    identificationType: '',
    identificationNumber: '',
    consentHealth: false,
    consentDisclosure: false,
    agreePrivacyPolicy: false,
  });
  const [file, setFile] = useState(null);
  const navigate = useNavigate(); // Initialize useNavigate

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setFormData({ ...formData, [name]: checked });
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const form = new FormData();
    Object.keys(formData).forEach((key) => {
      form.append(key, formData[key]);
    });
    if (file) {
      form.append('file', file);
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/users/complete-profile`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`, // Include JWT token
        },
        body: form,
      });
      const data = await response.json();
      if (response.ok) {
        alert(data.message); // Success message
        navigate('/'); // Redirect to landing page after successful profile completion
      } else {
        alert(data.message); // Error message
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="regform-container">
      <form onSubmit={handleSubmit} className="regform-form">
        <header className="regform-form-header">
          <img src={logo} alt="Netraya Logo" className="regform-form-logo" />
          <h1>Welcome</h1>
          <p>Let us know more about yourself</p>
        </header>

        <section className="regform-form-section">
          <h2>Personal Information</h2>
          <div className="regform-form-group">
            <div className="regform-input-icon">
              <FaUser className="icon" />
              <input
                type="text"
                name="fullName"
                placeholder="Full name"
                className="regform-form-input"
                value={formData.fullName}
                onChange={handleChange}
              />
            </div>
            <div className="regform-input-icon">
              <FaEnvelope className="icon" />
              <input
                type="email"
                name="email"
                placeholder="Email address"
                className="regform-form-input"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div className="regform-input-icon">
              <FaPhone className="icon" />
              <input
                type="tel"
                name="phone"
                placeholder="Phone number"
                className="regform-form-input"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>
            <div className="regform-input-icon">
              <FaCalendarAlt className="icon" />
              <input
                type="text"
                name="dob"
                placeholder="Date of Birth (dd-mm-yyyy)"
                className="regform-form-input"
                value={formData.dob}
                onChange={handleChange}
                onFocus={(e) => (e.target.type = 'date')}
                onBlur={(e) => (e.target.type = 'text')}
              />
            </div>

            <div className="regform-gender-group">
              <label className="regform-radio">
                <input
                  type="radio"
                  name="gender"
                  value="male"
                  checked={formData.gender === 'male'}
                  onChange={handleChange}
                />
                <span className="regform-radio-circle"></span>
                Male
              </label>
              <label className="regform-radio">
                <input
                  type="radio"
                  name="gender"
                  value="female"
                  checked={formData.gender === 'female'}
                  onChange={handleChange}
                />
                <span className="regform-radio-circle"></span>
                Female
              </label>
              <label className="regform-radio">
                <input
                  type="radio"
                  name="gender"
                  value="other"
                  checked={formData.gender === 'other'}
                  onChange={handleChange}
                />
                <span className="regform-radio-circle"></span>
                Other
              </label>
            </div>

            <div className="regform-input-icon">
              <FaMapMarkerAlt className="icon" />
              <input
                type="text"
                name="address"
                placeholder="Personal address"
                className="regform-form-input"
                value={formData.address}
                onChange={handleChange}
              />
            </div>
          </div>
        </section>

        <section className="regform-form-section">
          <h2>Medical Information</h2>
          <div className="regform-form-group">
            <input type="text" name="specialization" placeholder="Specialization" className="regform-form-input" value={formData.specialization} onChange={handleChange} />
            <input type="text" name="licenseNumber" placeholder="License number" className="regform-form-input" value={formData.licenseNumber} onChange={handleChange} />
            <input type="text" name="practiceLength" placeholder="Length of practice" className="regform-form-input" value={formData.practiceLength} onChange={handleChange} />
            <input type="text" name="affiliation" placeholder="Hospital/clinic affiliation" className="regform-form-input" value={formData.affiliation} onChange={handleChange} />
          </div>
        </section>

        <section className="regform-form-section">
          <h2>Identification and Verification</h2>
          <div className="regform-form-group">
            <select name="identificationType" className="regform-form-input" value={formData.identificationType} onChange={handleChange}>
              <option>Select Identification Type</option>
              <option>Board Certificate</option>
              <option>License</option>
              <option>Other</option>
            </select>
            <input type="text" name="identificationNumber" placeholder="Identification Number" className="regform-form-input" value={formData.identificationNumber} onChange={handleChange} />
            <div className="regform-file-upload">
              <FaUpload className="regform-upload-icon" />
              <input type="file" className="file-input" onChange={handleFileChange} />
              <small>PDF, JPG, or PNG file. Max size: 800×400px</small>
            </div>
          </div>
        </section>

        <section className="regform-form-section">
          <h2>Consent and Privacy</h2>
          <div className="regform-form-group regform-consent-group">
            <label className="regform-checkbox">
              <input type="checkbox" name="consentHealth" checked={formData.consentHealth} onChange={handleCheckboxChange} />
              <span className="regform-checkbox-custom"></span>
              I consent to receive treatment for my health condition.
            </label>
            <label className="regform-checkbox">
              <input type="checkbox" name="consentDisclosure" checked={formData.consentDisclosure} onChange={handleCheckboxChange} />
              <span className="regform-checkbox-custom"></span>
              I consent to the use and disclosure of my health information for treatment purposes.
            </label>
            <label className="regform-checkbox">
              <input type="checkbox" name="agreePrivacyPolicy" checked={formData.agreePrivacyPolicy} onChange={handleCheckboxChange} />
              <span className="regform-checkbox-custom"></span>
              I acknowledge that I have reviewed and agree to the privacy policy.
            </label>
          </div>
        </section>

        <button type="submit" className="regform-submit-button">Submit and continue</button>
      </form>
    </div>
  );
};

export default RegistrationForm;
