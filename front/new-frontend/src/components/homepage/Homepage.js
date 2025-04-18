import React from 'react';
import Navbar from './sections//Navbar';
import Hero from './sections//Hero';
import Welcome from './sections//Welcome';
import Features from './sections//Features';
// import Testimonials from './sections//Testimonials';
// import CTA from './sections//CTA';
// import Contact from './sections//Contact';
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
        {/* <Testimonials /> */}
        {/* <CTA /> */}
        {/* <Contact /> */}
      </main>
      <Footer />
    </div>
  );
};

export default Homepage;