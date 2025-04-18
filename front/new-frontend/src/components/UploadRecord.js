import React, { useState, useEffect } from "react";
import axios from "axios";
import "./UploadRecord.css";

const UploadRecord = () => {
  const [formData, setFormData] = useState({
    userId: "",
    hospitalName: "",
    visitDate: "",
    doctorName: "",
    diagnosis: "",
    medications: "",
    tests: "",
    nextAppointment: "",
    prescription: null
  });
  const [fileName, setFileName] = useState("");

  useEffect(() => {
    const storedUserId = localStorage.getItem("userID");
    if (storedUserId) {
      setFormData((prev) => ({ ...prev, userId: storedUserId }));
    } else {
      alert("User not logged in!");
      window.location.href = "/login";
    }
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleDateChange = (e) => {
    const dateString = new Date(e.target.value).toISOString().split("T")[0];
    setFormData({ ...formData, [e.target.name]: dateString });
  };

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setFormData({ ...formData, prescription: e.target.files[0] });
      setFileName(e.target.files[0].name);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      data.append(key, formData[key]);
    });

    try {
      await axios.post("http://localhost:5000/hospital/upload", data);
      alert("Record uploaded successfully!");
      window.location.href = "/Dashboard";
    } catch (error) {
      console.error("Error uploading record:", error);
      alert("Error uploading record. Please try again.");
    }
  };

  return (
    <div className="upload-container">
      <h1 className="upload-heading">Upload New Hospital Record</h1>
      <form className="upload-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <input
            className="form-input"
            type="text"
            name="hospitalName"
            placeholder="Hospital Name"
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Visit Date:</label>
          <input
            className="date-input"
            type="date"
            name="visitDate"
            onChange={handleDateChange}
            required
          />
        </div>

        <div className="form-group">
          <input
            className="form-input"
            type="text"
            name="doctorName"
            placeholder="Doctor Name"
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <input
            className="form-input"
            type="text"
            name="diagnosis"
            placeholder="Diagnosis"
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <input
            className="form-input"
            type="text"
            name="medications"
            placeholder="Medications"
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <input
            className="form-input"
            type="text"
            name="tests"
            placeholder="Tests"
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Next Appointment:</label>
          <input
            className="date-input"
            type="date"
            name="nextAppointment"
            onChange={handleDateChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Prescription:</label>
          <div className="file-input-container">
            <label className="file-input-label">
              <span>Click to upload prescription</span>
              <span className="file-input-text">or drag and drop</span>
              {fileName && <span className="file-name">{fileName}</span>}
              <input
                className="file-input"
                type="file"
                name="prescription"
                onChange={handleFileChange}
                required
              />
            </label>
          </div>
        </div>

        <button type="submit" className="submit-button">
          Upload Record
        </button>
      </form>
    </div>
  );
};

export default UploadRecord;