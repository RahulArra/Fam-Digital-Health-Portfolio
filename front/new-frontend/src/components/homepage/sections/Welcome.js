import React from 'react';
import './Welcome.css';

const Welcome = () => {
  return (
    <section id="about" className="welcome-section">
      <div className="container">
        <div className="welcome-content">
          <span className="section-subtitle">Welcome</span>
          <h2 className="section-title">A New Era of Health Management</h2>
          <div className="welcome-text">
            <p>
              Digital Health Portfolio revolutionizes how you manage your medical information. 
              No more scattered records across different hospitals and clinics - we bring everything 
              together in one secure, easy-to-access platform.
            </p>
            <p>
              Beyond just storage, our intelligent system analyzes your health data to provide 
              personalized recommendations, helping you make informed decisions about your wellbeing.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Welcome;