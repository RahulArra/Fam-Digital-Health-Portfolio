import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaUser, FaSignOutAlt, FaUpload, FaEdit, FaFileMedical, FaHospital, FaUserMd, FaPills, FaFlask, FaCalendarAlt } from "react-icons/fa";
import "./Dashboard.css";

const Dashboard = () => {
  const [records, setRecords] = useState([]);
  const [showImages, setShowImages] = useState({});
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const storedUserId = localStorage.getItem("userID");
    const storedUserName = localStorage.getItem("userName");
    
    if (!storedUserId) {
      alert("User not logged in!");
      navigate("/login");
      return;
    }
    
    if (storedUserName) {
      setUserName(storedUserName);
    }
    
    fetchRecords(storedUserId);
  }, [navigate]);

  const fetchRecords = async (userId) => {
    try {
      setLoading(true);
      const res = await axios.get(`http://localhost:5000/hospital/records/${userId}`);
      if (Array.isArray(res.data.data)) {
        setRecords(res.data.data);
        console.log("Fetched records:", res.data.data);

      } else {
        setRecords([]);
      }
    } catch (error) {
      console.error("Error fetching records:", error);
      setRecords([]);
    } finally {
      setLoading(false);
    }
  };

  const toggleImage = (recordId) => {
    setShowImages((prev) => ({
      ...prev,
      [recordId]: !prev[recordId],
    }));
  };

  const handleLogout = () => {
    localStorage.removeItem("userID");
    localStorage.removeItem("userName");
    navigate("/login");
  };

  return (
    <div className="dashboard-wrapper">
      {/* Navigation Bar */}
      <nav className="dashboard-nav">
        <div className="nav-brand">
          <FaFileMedical className="nav-icon" />
          <span>HealthRecords</span>
        </div>
        
        <div className="nav-actions">
          <button className="nav-profile" onClick={() => navigate("/profile")}>
            <FaUser className="profile-icon" />
            <span>{userName || "Profile"}</span>
          </button>
          <button className="nav-logout" onClick={handleLogout}>
            <FaSignOutAlt className="logout-icon" />
            <span>Logout</span>
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="dashboard-container">
        <div className="dashboard-header">
          <h1 className="dashboard-heading">
            <FaHospital className="heading-icon" />
            Hospital Records
          </h1>
          <button 
            className="upload-button" 
            onClick={() => navigate("/upload")}
          >
            <FaUpload className="button-icon" />
            Upload New Record
          </button>
        </div>

        {loading ? (
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>Loading your records...</p>
          </div>
        ) : records.length === 0 ? (
          <div className="empty-state">
            <FaFileMedical className="empty-icon" />
            <p className="no-records">No medical records found.</p>
            <p>Upload your first record to get started!</p>
          </div>
        ) : (
          <div className="records-container">
            {records.map((record) => (
              <div key={record._id} className="record-card">
                <div className="card-header">
                  <h3>
                    <FaHospital className="record-icon" />
                    {record.hospitalName}
                  </h3>
                  <span className="record-date">
                  {new Date(record.visitDate + 'T00:00:00Z').toLocaleDateString()}

</span>

                </div>
                
                <div className="card-body">
                  <div className="record-field">
                    <FaUserMd className="field-icon" />
                    <span className="field-label">Doctor:</span>
                    <span>{record.doctorName}</span>
                  </div>
                  
                  <div className="record-field">
                    <FaFileMedical className="field-icon" />
                    <span className="field-label">Diagnosis:</span>
                    <span>{record.diagnosis}</span>
                  </div>
                  
                  <div className="record-field">
                    <FaPills className="field-icon" />
                    <span className="field-label">Medications:</span>
                    <span>{record.medications}</span>
                  </div>
                  
                  <div className="record-field">
                    <FaFlask className="field-icon" />
                    <span className="field-label">Tests:</span>
                    <span>{record.tests}</span>
                  </div>
                  
                  <div className="record-field">
                    <FaCalendarAlt className="field-icon" />
                    <span className="field-label">Next Appointment:</span>
                    <span>{record.nextAppointment || "Not scheduled"}</span>
                  </div>
                </div>

                <div className="card-actions">
                  <button 
                    className="image-toggle" 
                    onClick={() => toggleImage(record._id)}
                  >
                    {showImages[record._id] ? "Hide Prescription" : "View Prescription"}
                  </button>
                  
                  <button 
                    className="edit-button" 
                    onClick={() => navigate(`/edit/${record._id}`)}
                  >
                    <FaEdit className="button-icon" />
                    Edit
                  </button>
                </div>

                {showImages[record._id] && (
                  <div className="prescription-container">
                    <img
                      src={record.prescription}
                      alt="Prescription"
                      className="prescription-image"
                      onError={(e) => {
                        e.target.style.display = "none";
                        e.target.nextElementSibling.style.display = "block";
                      }}
                    />
                    <p className="image-error" style={{ display: "none" }}>
                      Prescription image not available
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;