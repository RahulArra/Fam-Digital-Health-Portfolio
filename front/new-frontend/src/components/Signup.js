import React, { useState } from "react";
import './Signup.css';
import { useNavigate } from 'react-router-dom';

export default function Signup() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    Phone: ''
  });

  const [passwordError, setPasswordError] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const validatePassword = (password) => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (password.length < minLength) {
      return `Password must be at least ${minLength} characters long`;
    }
    if (!hasUpperCase) {
      return 'Password must contain at least one uppercase letter';
    }
    if (!hasLowerCase) {
      return 'Password must contain at least one lowercase letter';
    }
    if (!hasNumber) {
      return 'Password must contain at least one number';
    }
    if (!hasSpecialChar) {
      return 'Password must contain at least one special character';
    }
    return '';
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });

    if (name === 'password') {
      const error = validatePassword(value);
      setPasswordError(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (passwordError) {
      setMessage('Please fix password errors before submitting');
      return;
    }
    
    if (formData.password !== formData.confirmPassword) {
      setMessage("Passwords do not match");
      return;
    }

    const { confirmPassword, ...dataToSend } = formData;
    
    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSend)
      });

      const data = await response.json();
      if (response.ok) {
        setMessage('Signup successful! Please check your email to verify your account.');
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      } else {
        setMessage(data.error || 'Signup failed');
      }
    } catch (error) {
      setMessage('Error connecting to server');
    }
  };

  return (
    <div className="signup-wrapper">
      <div className="container1">
        <div className="left-column">
          <h1>Start Your Digital Health Journey</h1>
          <p>Sign up to track your hospital visits, monitor your health stats, and get personalized wellness insights.</p>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Your Name"
              required
            />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Your Email"
              required
            />
            <div className="password-field">
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Your Password"
                required
                minLength={8}
              />
              {passwordError && <div className="password-error">{passwordError}</div>}
              <div className="password-requirements">
                <p>Password must contain:</p>
                <ul>
                  <li className={formData.password.length >= 8 ? 'valid' : ''}>At least 8 characters</li>
                  <li className={/[A-Z]/.test(formData.password) ? 'valid' : ''}>One uppercase letter</li>
                  <li className={/[a-z]/.test(formData.password) ? 'valid' : ''}>One lowercase letter</li>
                  <li className={/[0-9]/.test(formData.password) ? 'valid' : ''}>One number</li>
                  <li className={/[!@#$%^&*(),.?":{}|<>]/.test(formData.password) ? 'valid' : ''}>One special character</li>
                </ul>
              </div>
            </div>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm Your Password"
              required
            />
            <input
              type="tel"
              name="Phone"
              value={formData.Phone}
              onChange={handleChange}
              placeholder="Your Phone Number"
              required
              minLength={10}
            />
            <button type="submit" disabled={passwordError}>Get Started</button>
            <div>
              <p style={{ marginTop: "10px" }}>
                Already have an account?{" "}
                <a href="/login" className="login-link">
                  Log in
                </a>
              </p>
            </div>
          </form>
          {message && <p className="message">{message}</p>}
        </div>

        <div className="right-column">
          <h1>Welcome to Your Digital Health Portfolio</h1>
          <p>Track your health, monitor hospital visits, and get personalized wellness suggestions — all in one secure platform.</p>
          <div className="image-placeholder">
            {/* Add an image or icon here */}
          </div>
        </div>
      </div>
    </div>
  );
}