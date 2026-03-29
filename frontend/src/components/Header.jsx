import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import './Header.css';
import ContactForm from "./ContactForm";

const Header = ({ isLoggedIn, setIsLoggedIn }) => {
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
  };

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className={`header ${scrolled ? 'scrolled' : ''}`}>
      <div className="logo">netraya.</div>

      <button className={`hamburger ${menuOpen ? 'open' : ''}`} onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
        <span></span>
        <span></span>
        <span></span>
      </button>

      <div className={`mobile-nav-overlay ${menuOpen ? 'open' : ''}`} onClick={closeMenu}></div>

      <nav className={menuOpen ? 'open' : ''}>
        <ul className="nav-links">
          <li><a href="#about" onClick={closeMenu}>About Us</a></li>
          <li><a href="#services" onClick={closeMenu}>Our Services</a></li>
          <li><a href="#articles" onClick={closeMenu}>Articles</a></li>
        </ul>
        <div className="auth-buttons">
          {isLoggedIn && (
            <button onClick={() => { handleLogout(); closeMenu(); }} className="contact-btn">Logout</button>
          )}
          <button onClick={() => { setIsContactOpen(true); closeMenu(); }} className="contact-btn">Contact Us</button>
        </div>
      </nav>

      <div className="auth-buttons desktop-auth">
        {isLoggedIn && (
          <button onClick={handleLogout} className="contact-btn">Logout</button>
        )}
        <button onClick={() => setIsContactOpen(true)} className="contact-btn">Contact Us</button>
      </div>

      <ContactForm
        isOpen={isContactOpen}
        onClose={() => setIsContactOpen(false)}
      />
    </header>
  );
};

export default Header;