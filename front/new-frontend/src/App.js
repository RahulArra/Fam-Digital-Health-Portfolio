import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Home from "./components/homepage/Homepage";
import Signup from "./components/Signup";
import Login from "./components/Login";
import Dashboard from './components/Dashboard';
import Profile from './components/Profile';
import UploadRecord from "./components/UploadRecord";
import EditRecord from "./components/EditRecord";
import VerifyEmail from "./components/verifyEmail";
import PrivateRoute from "./components/PrivateRoute";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />
      <Route path="/verify-email" element={<VerifyEmail />} />

      {/* Private Pages */}
      <Route path="/dashboard" element={
        <PrivateRoute>
          <Dashboard />
        </PrivateRoute>
      } />
      <Route path="/profile" element={
        <PrivateRoute>
          <Profile />
        </PrivateRoute>
      } />
      <Route path="/upload" element={
        <PrivateRoute>
          <UploadRecord />
        </PrivateRoute>
      } />
      <Route path="/edit/:id" element={
        <PrivateRoute>
          <EditRecord />
        </PrivateRoute>
      } />
    </Routes>
  );
};

export default App;
