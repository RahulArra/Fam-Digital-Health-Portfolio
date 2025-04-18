import React, { useState } from 'react';
import './CTA.css';

const CTA = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
      setEmail('');
      setTimeout(() => setSubmitted(false), 3000);
    }
  };

  return (
    <section className="cta-section gradient-bg">
      <div className="container">
        <div className="cta-content">
          <h2>Ready to take control of your health?</h2>
          <p>Start your Digital Health Portfolio today.</p>
          
          {submitted ? (
            <div className="success-message">
              Thank you! We'll be in touch soon.
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="cta-form">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
              />
              <button type="submit" className="btn btn-white">
                Get Started
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};

export default CTA;