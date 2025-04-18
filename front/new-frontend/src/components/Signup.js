// import React, { useState } from "react";
// import './Signup.css';
// import { useNavigate } from 'react-router-dom';

// export default function Signup() {
//   const [formData, setFormData] = useState({
//     name: '',
//     email: '',
//     password: '',
//     confirmPassword:'',
//     Phone: ''  // ✅ Added Phone field
//   });
  
//   const [message, setMessage] = useState('');  // To store success/error message
//   const navigate = useNavigate();  // Initialize navigation

//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value
//     });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (formData.password !== formData.confirmPassword) {
//       alert("Passwords do not match");
//       return;
//     }
//     const { confirmPassword, ...dataToSend } = formData; // Remove confirmPassword before sending
//     try {
//         const response = await fetch('http://localhost:5000/api/auth/register', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(dataToSend)
//       });

//       const data = await response.json();
//       if (response.ok) {
//         setMessage('Signup successful! Please check your email to verify your account.');
//         setTimeout(() => {
//           navigate('/login'); // Redirect to login page after 3 seconds
//         }, 3000);
//       } else {
//         setMessage(data.error || 'Signup failed');
//       }
//     } catch (error) {
//       setMessage('Error connecting to server');
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-100">
//       <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-lg w-96">
//         <h2 className="text-2xl font-bold mb-6 text-center">Sign Up</h2>
//         {message && <p className="text-center text-green-500">{message}</p>} {/* Display success or error message */}
        
//         <div className="mb-4">
//           <label className="block mb-2">Name</label>
//           <input
//             type="text"
//             name="name"
//             value={formData.name}
//             onChange={handleChange}
//             className="w-full p-2 border rounded-xl"
//             required
//           />
//         </div>
//         <div className="mb-4">
//           <label className="block mb-2">Email</label>
//           <input
//             type="email"
//             name="email"
//             value={formData.email}
//             onChange={handleChange}
//             className="w-full p-2 border rounded-xl"
//             required
//           />
//         </div>
//         <div className="mb-4">
//           <label className="block mb-2">Phone</label>
//           <input
//             type="tel"  // ✅ Input type updated to tel
//             name="Phone"
//             value={formData.Phone}
//             onChange={handleChange}
//             className="w-full p-2 border rounded-xl"
//             required
//             minLength={10}
//           />
//         </div>
//         <div className="mb-6">
//           <label className="block mb-2">Password</label>
//           <input
//             type="password"
//             name="password"
//             value={formData.password}
//             onChange={handleChange}
//             className="w-full p-2 border rounded-xl"
//             required
//             minLength={8}
//           />
//         </div>
//         <div className="mb-6">
//           <label className="block mb-2">Re-enter Password</label>
//           <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} className="w-full p-2 border rounded-xl" required minLength={8} />
//         </div>
//         <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded-xl hover:bg-blue-600">
//           Sign Up
//         </button>
//         <p className="redirect">
//           Do you have an account? <a href="/login">login</a>
//         </p>
//       </form>
//     </div>
//   );
// }



import React, { useState } from "react";
import './Signup.css';  // Import your CSS
import { useNavigate } from 'react-router-dom';

export default function Signup() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    Phone: ''  // Added Phone field
  });

  const [message, setMessage] = useState('');  // To store success/error message
  const navigate = useNavigate();  // Initialize navigation

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    const { confirmPassword, ...dataToSend } = formData; // Remove confirmPassword before sending
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
          navigate('/login'); // Redirect to login page after 3 seconds
        }, 3000);
      } else {
        setMessage(data.error || 'Signup failed');
      }
    } catch (error) {
      setMessage('Error connecting to server');
    }
  };

  return (
    <div className="signup-wrapper" >
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
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Your Password"
            required
            minLength={6}
          />
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
          <button type="submit">Get Started</button>
          <div><p style={{ marginTop: "10px" }}>
    Already have an account?{" "}
    <a href="/login" style={{ color: "#007bff", textDecoration: "underline" }}>
      Log in
    </a>
  </p></div>
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
