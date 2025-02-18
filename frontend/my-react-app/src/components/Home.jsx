import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const HomePage = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.style.animation = 'slideIn 0.5s ease forwards';
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll('.benefits-list li').forEach((item) => {
      observer.observe(item);
    });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      observer.disconnect();
    };
  }, []);

  return (
    <div className="home-container">
      {/* Use isScrolled in the className */}
      <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
        <div className="logo">Digital Health Portfolio</div>
        <button 
          className="mobile-menu-button"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
        <div className={`nav-links ${isMenuOpen ? 'active' : ''}`}>
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/login" className="nav-link">Login</Link>
          <Link to="/signup" className="nav-link">Signup</Link>
          <Link to="/about" className="nav-link">About</Link>
          <Link to="/contact" className="nav-link">Contact</Link>
        </div>
      </nav>

      <main className="main-content">
        {/* Rest of your main content */}
        {/* Make sure all the sections from your original code are included here */}
        <section className="welcome-section">
        <img src="https://images.unsplash.com/photo-1580281657526-9d9a3f6f1172" alt="Health" className="welcome-image" />          <div className="welcome-text">
            <h2>Welcome to Our Website</h2>
            <p>Discover a comprehensive platform for managing your health records with ease and security.</p>
          </div>
        </section>
        <section className="features-section">
          <h2>Features</h2>
          <div className="features-cards">
            <div className="feature-card">
              <h3>Health Record Management</h3>
              <p>Store and access detailed medical histories, including hospital visits, doctor consultations, prescriptions, and test reports.</p>
            </div>
            <div className="feature-card">
              <h3>BMI and Health Tracking</h3>
              <p>Calculate BMI, monitor weight, and visualize health trends through interactive graphs.</p>
            </div>
            <div className="feature-card">
              <h3>Personalized Health Recommendations</h3>
              <p>Receive dietary and nutrition recommendations based on your BMI and health status using AI/ML.</p>
            </div>
            <div className="feature-card">
              <h3>Secure and Scalable Architecture</h3>
              <p>Ensure data privacy and security with JWT authentication and AES-256 encryption.</p>
            </div>
            <div className="feature-card">
              <h3>User-Friendly Interface</h3>
              <p>Enjoy an intuitive experience with a responsive design built using React.js and Material-UI.</p>
            </div>
          </div>
        </section>
        <section className="benefits-section">
          <h2>How will users benefit?</h2>
          <ul className="benefits-list">
            <li>Centralized storage for all health records</li>
            <li>Easy access and retrieval of medical data</li>
            <li>Personalized health and diet recommendations</li>
            <li>Secure and private data management</li>
            <li>Interactive and user-friendly interface</li>
          </ul>
        </section>
      </main>

      <footer className="footer">
        <h2>Contact Us</h2>
        <p>If you have any questions or need support, please contact us at <a href="mailto:support@digitalhealthportfolio.com">support@digitalhealthportfolio.com</a>.</p>
        <p>Follow us on:</p>
        <div className="social-links">
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">Facebook</a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">Twitter</a>
          <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">LinkedIn</a>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;