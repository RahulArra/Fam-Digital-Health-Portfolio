import React, { useState, useEffect } from "react";
import axios from "axios";

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
    const dateString = new Date(e.target.value).toISOString().split("T")[0]; // Convert to "YYYY-MM-DD"
    setFormData({ ...formData, [e.target.name]: dateString });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, prescription: e.target.files[0] });
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
    }
  };

  return (
    <div>
      <h1>Upload New Hospital Record</h1>
      <form onSubmit={handleSubmit}>
        <input type="text" name="hospitalName" placeholder="Hospital Name" onChange={handleChange} required />
        
        <label>Visit Date:</label>
        <input type="date" name="visitDate" onChange={handleDateChange} required />

        <input type="text" name="doctorName" placeholder="Doctor Name" onChange={handleChange} required />
        <input type="text" name="diagnosis" placeholder="Diagnosis" onChange={handleChange} required />
        <input type="text" name="medications" placeholder="Medications" onChange={handleChange} required />
        <input type="text" name="tests" placeholder="Tests" onChange={handleChange} required />

        <label>Next Appointment:</label>
        <input type="date" name="nextAppointment" onChange={handleDateChange} required />

        <input type="file" name="prescription" onChange={handleFileChange} required />
        <button type="submit">Upload Record</button>
      </form>
    </div>
  );
};

export default UploadRecord;
