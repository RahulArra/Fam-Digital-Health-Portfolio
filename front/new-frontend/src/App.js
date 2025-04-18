import React from 'react';
import { Route, Routes } from 'react-router-dom';
// import Home from "./components/Home";
import Home from "./components/homepage/Homepage";

import Signup from "./components/Signup";
import Login from "./components/Login";
import Dashboard from './components/Dashboard';
import Profile from './components/Profile';
import UploadRecord from "./components/UploadRecord";
import EditRecord from "./components/EditRecord";
import VerifyEmail from "./components/verifyEmail";

const App = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Signup" element={<Signup />} />
        <Route path="/Login" element={<Login />} />
        <Route path ="/Dashboard" element = {<Dashboard />} />
        <Route path ="/Profile" element = {<Profile />} />
        <Route path="/upload" element={<UploadRecord />} />
        <Route path="/edit/:id" element={<EditRecord />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
      </Routes>
    </>
  );
};

export default App;
  