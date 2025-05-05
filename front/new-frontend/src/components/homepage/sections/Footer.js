import React from 'react';
import './Footer.css';
import { FaTwitter, FaFacebookF, FaLinkedinIn } from 'react-icons/fa';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <div className="brand-logo">
              <span className="heart-icon">❤</span>
              <span>Digital Health Portfolio</span>
            </div>
            <p className="brand-description">
              Your complete health records solution for better healthcare management.
            </p>
          </div>
          
          <div className="footer-links">
            <div className="links-column">
              <h4>Product</h4>
              <ul>
                <li><a href="#features">Features</a></li>
                <li><a href="#">Pricing</a></li>
                <li><a href="#">API</a></li>
              </ul>
            </div>
            
            <div className="links-column">
              <h4>Company</h4>
              <ul>
                <li><a href="#about">About</a></li>
                <li><a href="#">Blog</a></li>
                <li><a href="#">Careers</a></li>
              </ul>
            </div>
            
            <div className="links-column">
              <h4>Legal</h4>
              <ul>
                <li><a href="#">Privacy</a></li>
                <li><a href="#">Terms</a></li>
                <li><a href="#">HIPAA</a></li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="footer-bottom">
          <div className="copyright">
            &copy; {currentYear} Digital Health Portfolio. All rights reserved.
          </div>

          
          <div className="social-links">
            <a href="#" aria-label="Twitter">
              <FaTwitter />
            </a>
            <a href="#" aria-label="Facebook">
              <FaFacebookF />
            </a>
            <a href="#" aria-label="LinkedIn">
              <FaLinkedinIn />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;