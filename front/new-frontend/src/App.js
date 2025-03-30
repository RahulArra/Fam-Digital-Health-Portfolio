import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Home from "./components/Home";
import Signup from "./components/Signup";
import Login from "./components/Login";
import Dashboard from './components/Dashboard';
import Profile from './components/Profile';

const App = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Signup" element={<Signup />} />
        <Route path="/Login" element={<Login />} />
        <Route path ="/Dashboard" element = {<Dashboard />} />
        <Route path ="/Profile" element = {<Profile />} />
      </Routes>
    </>
  );
};

export default App;
  