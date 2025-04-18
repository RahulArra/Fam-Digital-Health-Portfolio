import React from 'react';
import './Features.css';
import { FaFolderOpen, FaChartLine, FaLightbulb, FaShieldAlt, FaMobileAlt, FaUserMd } from 'react-icons/fa';

const features = [
  {
    icon: <FaFolderOpen />,
    title: "Unified Health Records",
    description: "Store all your medical records from different hospitals in one secure place."
  },
  {
    icon: <FaChartLine />,
    title: "Health Analytics",
    description: "Our system tracks your health metrics over time, identifying trends and patterns."
  },
  {
    icon: <FaLightbulb />,
    title: "Personalized Suggestions",
    description: "Get tailored health recommendations based on your medical history."
  },
  {
    icon: <FaShieldAlt />,
    title: "Military-Grade Security",
    description: "Your sensitive health data is protected with end-to-end encryption."
  },
  {
    icon: <FaMobileAlt />,
    title: "Mobile Access",
    description: "Access your health portfolio on the go with our iOS and Android apps."
  },
  {
    icon: <FaUserMd />,
    title: "Doctor Sharing",
    description: "Easily share your records with healthcare providers."
  }
];

const Features = () => {
  return (
    <section id="features" className="features-section">
      <div className="container">
        <div className="section-header">
          <span className="section-subtitle">Features</span>
          <h2 className="section-title">Everything You Need for Better Health</h2>
        </div>
        <div className="features-grid">
          {features.map((feature, index) => (
            <div key={index} className="feature-card">
              <div className="feature-icon">{feature.icon}</div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;