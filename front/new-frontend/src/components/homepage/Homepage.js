import React from 'react';
import Navbar from './sections//Navbar';
import Hero from './sections//Hero';
import Welcome from './sections//Welcome';
import Features from './sections//Features';
import Footer from './sections//Footer';
import './Homepage.css';

const Homepage = () => {
  return (
    <div className="homepage">
      <Navbar />
      <main>
        <Hero />
        <Welcome />
        <Features />
      </main>
      <Footer />
    </div>
  );
};

export default Homepage;