import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FiMail, FiLock, FiUser, FiArrowRight } from 'react-icons/fi';
import './Login.css';

const Login = () => {
  const [user, setUser] = useState({ email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [shake, setShake] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', user);
      
      if (res.data.userID) {
        localStorage.setItem('userID', res.data.userID);
        navigate('/Profile');
      } else {
        triggerError('Login successful, but userID not found.');
      }
    } catch (error) {
      triggerError(error.response?.data.error || 'Login failed. Try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const triggerError = (message) => {
    setShake(true);
    setTimeout(() => setShake(false), 500);
    alert(message);
  };

  return (
    <div className="login-container">
      <div className="login-background">
        <div className="shape"></div>
        <div className="shape"></div>
      </div>
      
      <form 
        onSubmit={handleSubmit} 
        className={`login-form ${shake ? 'shake' : ''}`}
      >
        <h2 className="login-title">Welcome Back</h2>
        <p className="login-subtitle">Please enter your credentials to login</p>
        
        <div className="form-group">
          <div className="input-container">
            <FiMail className="input-icon" />
            <input
              type="email"
              name="email"
              value={user.email}
              onChange={handleChange}
              placeholder="Email Address"
              required
            />
          </div>
        </div>
        
        <div className="form-group">
          <div className="input-container">
            <FiLock className="input-icon" />
            <input
              type="password"
              name="password"
              value={user.password}
              onChange={handleChange}
              placeholder="Password"
              required
            />
          </div>
        </div>
        
        <div className="form-options">
          <label className="remember-me">
            <input type="checkbox" />
            <span>Remember me</span>
          </label>
          <a href="/forgot-password" className="forgot-password">Forgot password?</a>
        </div>
        
        <button type="submit" className="login-button" disabled={isLoading}>
          {isLoading ? (
            <span className="spinner"></span>
          ) : (
            <>
              Log In <FiArrowRight className="button-icon" />
            </>
          )}
        </button>
        
        
        <p className="redirect">
          Don't have an account? <a href="/signup" className="signup-link">Sign Up</a>
        </p>
      </form>
    </div>
  );
};

export default Login;