import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import "./Login.css";  
const Login = () => {
  const [user, setUser] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post('http://localhost:5000/api/login', user);
      alert(res.data.message);
      navigate('/');
    } catch (error) {
      alert(error.response?.data.message || 'Login failed. Try again.');
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email</label>
          <input type="email" name="email" onChange={handleChange} placeholder="Enter your email" required />
        </div>
        <div>
          <label>Password</label>
          <input type="password" name="password" onChange={handleChange} placeholder="Enter your password" required />
        </div>
        <button type="submit">Log In</button>
      </form>
      <p>Dont have an account? <a href="/signup">Sign Up</a></p>
    </div>
  );
};

export default Login;
