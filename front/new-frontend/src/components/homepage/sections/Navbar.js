import React from 'react';
import './Navbar.css';
import { FaHeartbeat } from 'react-icons/fa';
import VisitorCounter from './Visitor';  // Importing the VisitorCounter component
const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="container">
        <div className="navbar-brand">
          <FaHeartbeat className="navbar-icon" />
          <span>Digital Health Portfolio</span>
        </div>
        <div className="navbar-links">
          <a href="#features">Features</a>
          <a href="#about">About</a>
          <a href="#contact">Contact</a>
          <a href="signup" className="btn btn-primary">Get Started</a>
          {/* Display the visitor count */}
          <div className="visitor-count">
            <VisitorCounter />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;