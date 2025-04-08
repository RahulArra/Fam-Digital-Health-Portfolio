import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Home from "./components/Home";
import Signup from "./components/Signup";
import Login from "./components/Login";
import Dashboard from './components/Dashboard';
import Profile from './components/Profile';
import UploadRecord from "./components/UploadRecord";
import EditRecord from "./components/EditRecord";
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
      </Routes>
    </>
  );
};

export default App;
  