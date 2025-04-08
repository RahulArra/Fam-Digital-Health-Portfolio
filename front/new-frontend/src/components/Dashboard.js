import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Dashboard.css";

const Dashboard = () => {
  const [records, setRecords] = useState([]);
  const [showImages, setShowImages] = useState({});

  useEffect(() => {
    const storedUserId = localStorage.getItem("userID");
    if (!storedUserId) {
      alert("User not logged in!");
      window.location.href = "/login";
      return;
    }
    fetchRecords(storedUserId);
  }, []);

  const fetchRecords = async (userId) => {
    try {
      const res = await axios.get(`http://localhost:5000/hospital/records/${userId}`);
      if (Array.isArray(res.data.data)) {
        setRecords(res.data.data);
      } else {
        setRecords([]);
      }
    } catch (error) {
      console.error("Error fetching the  records:", error);
      setRecords([]);
    }
  };

  const toggleImage = (recordId) => {
    setShowImages((prev) => ({
      ...prev,
      [recordId]: !prev[recordId],
    }));
  };

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-heading">Hospital Records</h1>
      <button className="upload-button" onClick={() => (window.location.href = "/upload")}>
        Upload New Record
      </button>

      {records.length === 0 ? (
        <p className="no-records">No records found.</p>
      ) : (
        <div className="records-container">
          {records.map((record) => (
            <div key={record._id} className="record-card">
              <h3>{record.hospitalName}</h3>
              <p><strong>Doctor:</strong> {record.doctorName}</p>
              <p><strong>Diagnosis:</strong> {record.diagnosis}</p>
              <p><strong>Medications:</strong> {record.medications}</p>
              <p><strong>Tests:</strong> {record.tests}</p>
              <p><strong>Next Appointment:</strong> {record.nextAppointment}</p>

              <button className="image-toggle" onClick={() => toggleImage(record._id)}>
                {showImages[record._id] ? "Hide Prescription" : "Show Prescription"}
              </button>
              {showImages[record._id] && (
                <img
                  src={record.prescription}
                  alt="Prescription"
                  className="prescription-image"
                  onError={(e) => (e.target.style.display = "none")}
                />
              )}

              <button className="edit-button" onClick={() => (window.location.href = `/edit/${record._id}`)}>
                Edit Record
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
