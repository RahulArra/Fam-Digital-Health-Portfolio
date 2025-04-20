import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaUser, FaSignOutAlt, FaUpload, FaEdit, FaFileMedical, FaHospital, FaUserMd, FaPills, FaFlask, FaCalendarAlt } from "react-icons/fa";
import "./Dashboard.css";

const Dashboard = () => {
  const [records, setRecords] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState({});
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState("");
  const navigate = useNavigate();
  const [showImages, setShowImages] = useState({});
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
      [recordId]: !prev[recordId],  // Toggle the visibility on each click
    }));
  // Reset image index to 0 when toggling the images
  setCurrentImageIndex((prev) => ({
    ...prev,
    [recordId]: 0,
  }));
};

const handleImageNavigation = (recordId, direction) => {
  setCurrentImageIndex((prev) => {
    const currentIndex = prev[recordId] || 0;
    const imagesCount = records.find((record) => record._id === recordId)?.prescription.length || 0;
    let newIndex = currentIndex + direction;
    
    // Ensure the index stays within bounds
    if (newIndex < 0) newIndex = imagesCount - 1;
    if (newIndex >= imagesCount) newIndex = 0;

    return { ...prev, [recordId]: newIndex };
  });
};

  const handleLogout = () => {
    localStorage.removeItem("userID");
    localStorage.removeItem("userName");
    navigate("/login");
  };

  const handleDelete = async (recordId, cloudinaryUrl) => {
    if (!window.confirm("Are you sure you want to delete this record?")) return;
  
    try {
      await axios.delete(`http://localhost:5000/hospital/${recordId}`, {
        data: { imageUrl: cloudinaryUrl }
      });
  
      setRecords((prev) => prev.filter((r) => r._id !== recordId));
      alert("Record deleted successfully!");
    } catch (error) {
      console.error("Error deleting record:", error);
      alert("Failed to delete the record.");
    }
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
                <button
                  className="delete-button"
                  onClick={() => handleDelete(record._id, record.prescription)}
                >
                  🗑️
                </button>

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
                    {record.prescription.length > 1 ? "View Prescriptions" : "View Prescription"}
                  </button>
                  <button 
                    className="edit-button" 
                    onClick={() => navigate(`/edit/${record._id}`)}
                  >
                    <FaEdit className="button-icon" />
                    Edit
                  </button>
                </div>

                {showImages[record._id] && record.prescription.length > 1 && (
                  <div className="prescription-container">
                    <button 
                      className="image-nav left" 
                      onClick={() => handleImageNavigation(record._id, -1)}
                    >
                      ◀
                    </button>
                    <img
                      src={record.prescription[currentImageIndex[record._id] || 0]}
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
                    <button 
                      className="image-nav right" 
                      onClick={() => handleImageNavigation(record._id, 1)}
                    >
                      ▶
                    </button>
                  </div>
                )}
                {showImages[record._id] && record.prescription.length === 1 && (
                  <div className="prescription-container">
                    <img
                      src={record.prescription[0]}
                      alt="Prescription"
                      className="prescription-image"
                    />
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
