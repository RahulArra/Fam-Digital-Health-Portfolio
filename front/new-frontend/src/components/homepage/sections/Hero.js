import React from 'react';
import './Hero.css';

const Hero = () => {
  return (
    <section className="hero gradient-bg">
      <div className="container">
        <div className="hero-content">
          <h1>Your Health, Simplified</h1>
          <p>A centralized platform for all your medical records and health insights.</p>
          <div className="hero-buttons">
            <a href="/Signup" className="btn btn-white pulse-animation">Sign Up Free</a>
            <a href="#" className="btn btn-outline">Learn More</a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;