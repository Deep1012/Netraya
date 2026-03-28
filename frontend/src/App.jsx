import { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header from './components/Header';
import Hero from './components/Hero';
import AboutUs from './components/AboutUs';
import Services from './components/Services';
import Articles from './components/Articles';
import Footer from './components/Footer';
import SignUpForm from "./components/User/SignUpForm";
import SignInForm from "./components/User/SignInForm";
import ServicesPage from "./components/model/ServicesPage";
import RegistrationForm from "./components/User/RegistrationForm";
import { ToastContainer } from "./components/ui/Toast";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check if the user is logged in by looking for a token in localStorage
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

  return (
    <Router>
      <div className="App">
        <ToastContainer />
        <Routes>
          {/* Route for the landing page */}
          <Route path="/" element={
            <>
              <Header isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
              <Hero />
              <AboutUs />
              <Services isLoggedIn={isLoggedIn} />
              <Articles />
              <Footer />
            </>
          } />

          {/* Route for Sign Up page */}
          <Route path="/signup" element={<SignUpForm />} />

          {/* Route for Sign In page, passing setIsLoggedIn to update login state */}
          <Route path="/signin" element={<SignInForm setIsLoggedIn={setIsLoggedIn} />} />

          {/* Route for ServicesPage */}
          <Route path="/servicespage" element={<ServicesPage />} />

          {/* Route for RegistrationForm, to complete profile for new users */}
          <Route path="/registrationform" element={<RegistrationForm />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
