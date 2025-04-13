import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const EditRecord = () => {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    hospitalName: "",
    doctorName: "",
    diagnosis: "",
    medications: "",
    tests: "",
    nextAppointment: "",
  });

  useEffect(() => {
    fetchRecord();
  }, []);

  const fetchRecord = async () => {
    try {
        const res = await axios.get(`http://localhost:5000/hospital/records/id/${id}`); // Updated URL
        // console.log("API Response:", res.data); // Debugging: Check API response structure
      
      if (res.data && res.data.data) {
        const record = res.data.data;
        setFormData({
          hospitalName: record.hospitalName || "",
          doctorName: record.doctorName || "",
          diagnosis: record.diagnosis || "",
          medications: record.medications || "",
          tests: record.tests || "",
          nextAppointment: record.nextAppointment || "",
        });
      } else {
        console.error("Invalid response format:", res.data);
      }
    } catch (error) {
      console.error("Error fetching record:", error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5000/hospital/update/${id}`, formData);
      alert("Record updated successfully!");
      window.location.href = "/";
    } catch (error) {
      console.error("Error updating record:", error);
      alert("Failed to update record. Please try again.");
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Edit Hospital Record</h1>
      <form onSubmit={handleSubmit} style={styles.form}>
        <label>Hospital Name</label>
        <input type="text" name="hospitalName" value={formData.hospitalName} onChange={handleChange} required />

        <label>Doctor Name</label>
        <input type="text" name="doctorName" value={formData.doctorName} onChange={handleChange} required />

        <label>Diagnosis</label>
        <input type="text" name="diagnosis" value={formData.diagnosis} onChange={handleChange} required />

        <label>Medications</label>
        <input type="text" name="medications" value={formData.medications} onChange={handleChange} required />

        <label>Tests</label>
        <input type="text" name="tests" value={formData.tests} onChange={handleChange} required />

        <label>Next Appointment</label>
        <input type="date" name="nextAppointment" value={formData.nextAppointment} onChange={handleChange} required />

        <button type="submit" style={styles.submitButton}>Update Record</button>
      </form>
    </div>
  );
};

const styles = {
  container: { maxWidth: "500px", margin: "auto", padding: "20px", textAlign: "center" },
  heading: { fontSize: "24px", marginBottom: "20px" },
  form: { display: "flex", flexDirection: "column", gap: "10px" },
  submitButton: { padding: "10px", backgroundColor: "#007bff", color: "white", border: "none", cursor: "pointer", marginTop: "15px" },
};

export default EditRecord;
