import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import './UploadRecord.css';

const EditRecord = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    hospitalName: "",
    doctorName: "",
    diagnosis: "",
    medications: "",
    tests: "",
    nextAppointment: "",
    visitDate: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const [prescriptionImages, setPrescriptionImages] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [notification, setNotification] = useState({ show: false, message: "", type: "" });

  // Show notification and auto-hide after 3 seconds
  const showNotification = (message, type = "success") => {
    setNotification({ show: true, message, type, visible: true });
    setTimeout(() => {
      setNotification(prev => ({ ...prev, visible: false }));
      setTimeout(() => setNotification({ show: false, message: "", type: "" }), 300);
    }, 3000);
  };

  useEffect(() => {
    fetchRecord();
  }, [id]);

  const fetchRecord = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get(`http://localhost:5000/hospital/records/id/${id}`);
      
      if (res.data && res.data.data) {
        const record = res.data.data;
        setFormData({
          hospitalName: record.hospitalName || "",
          doctorName: record.doctorName || "",
          diagnosis: record.diagnosis || "",
          medications: record.medications || "",
          tests: record.tests || "",
          nextAppointment: record.nextAppointment ? record.nextAppointment.split('T')[0] : "",
          visitDate: record.visitDate ? record.visitDate.split('T')[0] : ""
        });
        
        if (record.prescription) {
          setExistingImages(record.prescription);
        }
      }
    } catch (error) {
      console.error("Error fetching record:", error);
      showNotification("Failed to fetch record details", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files).map(file => ({
        file,
        preview: URL.createObjectURL(file)
      }));
      setPrescriptionImages(prev => [...prev, ...filesArray]);
    }
  };

  const removeImage = (index) => {
    setPrescriptionImages(prev => prev.filter((_, i) => i !== index));
  };

  const removeExistingImage = async (imageUrl, publicId) => {
    try {
      await axios.delete(`http://localhost:5000/hospital/remove-image`, {
        data: { recordId: id, imageUrl, publicId }
      });
      setExistingImages(prev => prev.filter(img => img !== imageUrl));
      showNotification("Image removed successfully");
    } catch (error) {
      console.error("Error removing image:", error);
      showNotification("Failed to remove image", "error");
    }
  };
  const notificationStyles = {
    position: 'fixed',
    top: '20px',
    right: '20px',
    padding: '15px',
    borderRadius: '4px',
    color: 'white',
    zIndex: 1000,
    backgroundColor: notification.type === "error" ? '#e74c3c' : '#27ae60',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.2)',
    transition: 'all 0.3s ease',
    opacity: notification.visible ? 1 : 0,
    transform: notification.visible ? 'translateX(0)' : 'translateX(20px)',
    cursor: 'pointer'
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const formDataToSend = new FormData();
      
      // Append text fields
      Object.entries(formData).forEach(([key, value]) => {
        if (value) formDataToSend.append(key, value);
      });
      
      // Append new images - changed from 'prescriptions' to 'documents'
      prescriptionImages.forEach(image => {
        formDataToSend.append('documents', image.file); // Changed field name here
      });
      
      await axios.put(`http://localhost:5000/hospital/update/${id}`, formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      showNotification("Record updated successfully!");
      navigate("/dashboard");
    } catch (error) {
      console.error("Error updating record:", error);
      showNotification(error.response?.data?.error || "Failed to update record", "error");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner}></div>
        <p>Loading record details...</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Edit Hospital Record</h1>
      
      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.formGroup}>
          <label style={styles.label}>Hospital Name</label>
          <input
            type="text"
            name="hospitalName"
            value={formData.hospitalName}
            onChange={handleChange}
            style={styles.input}
            required
          />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Doctor Name</label>
          <input
            type="text"
            name="doctorName"
            value={formData.doctorName}
            onChange={handleChange}
            style={styles.input}
            required
          />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Visit Date</label>
          <input
            type="date"
            name="visitDate"
            value={formData.visitDate}
            onChange={handleChange}
            style={styles.input}
            required
          />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Diagnosis</label>
          <textarea
            name="diagnosis"
            value={formData.diagnosis}
            onChange={handleChange}
            style={{...styles.input, minHeight: '80px'}}
            required
          />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Medications</label>
          <textarea
            name="medications"
            value={formData.medications}
            onChange={handleChange}
            style={{...styles.input, minHeight: '80px'}}
            required
          />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Tests</label>
          <textarea
            name="tests"
            value={formData.tests}
            onChange={handleChange}
            style={{...styles.input, minHeight: '80px'}}
          />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Next Appointment</label>
          <input
            type="date"
            name="nextAppointment"
            value={formData.nextAppointment}
            onChange={handleChange}
            style={styles.input}
          />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Prescription Images</label>
          <div style={styles.imagePreviewContainer}>
            {existingImages.map((image, index) => (
              <div key={index} style={styles.imageWrapper}>
                <img 
                  src={image} 
                  alt={`Prescription ${index}`} 
                  style={styles.previewImage}
                />
                <button
                  type="button"
                  onClick={() => removeExistingImage(image, formData.prescriptionPublicId?.[index])}
                  style={styles.removeImageButton}
                >
                  ×
                </button>
              </div>
            ))}
            {prescriptionImages.map((image, index) => (
              <div key={`new-${index}`} style={styles.imageWrapper}>
                <img 
                  src={image.preview} 
                  alt={`New prescription ${index}`} 
                  style={styles.previewImage}
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  style={styles.removeImageButton}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
          <input
            type="file"
            id="prescription-upload"
            onChange={handleImageChange}
            style={{ display: 'none' }}
            multiple
            accept="image/*"
          />
          <label htmlFor="prescription-upload" style={styles.uploadButton}>
            Add Prescription Images
          </label>
        </div>

        <div style={styles.buttonGroup}>
          <button 
            type="submit" 
            style={styles.submitButton}
            disabled={isLoading}
          >
            {isLoading ? 'Updating...' : 'Update Record'}
          </button>
          <button 
            type="button" 
            onClick={() => navigate(-1)}
            style={styles.cancelButton}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

const styles = {
  container: { 
    maxWidth: "800px", 
    margin: "2rem auto", 
    padding: "2rem",
    backgroundColor: "#fff",
    borderRadius: "8px",
    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)"
  },
  heading: { 
    fontSize: "1.8rem", 
    marginBottom: "2rem",
    color: "#2c3e50",
    textAlign: "center"
  },
  form: { 
    display: "flex", 
    flexDirection: "column", 
    gap: "1.5rem" 
  },
  formGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem"
  },
  label: {
    fontSize: "0.9rem",
    fontWeight: "500",
    color: "#34495e"
  },
  input: {
    padding: "0.8rem",
    border: "1px solid #ddd",
    borderRadius: "4px",
    fontSize: "1rem",
    transition: "border 0.3s ease",
    width: "100%",
    boxSizing: "border-box"
  },
  imagePreviewContainer: {
    display: "flex",
    flexWrap: "wrap",
    gap: "1rem",
    margin: "1rem 0"
  },
  imageWrapper: {
    position: "relative",
    width: "100px",
    height: "100px"
  },
  previewImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    borderRadius: "4px",
    border: "1px solid #eee"
  },
  removeImageButton: {
    position: "absolute",
    top: "-8px",
    right: "-8px",
    width: "24px",
    height: "24px",
    borderRadius: "50%",
    background: "#e74c3c",
    color: "white",
    border: "none",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "12px"
  },
  uploadButton: {
    display: "inline-block",
    padding: "0.8rem 1.2rem",
    backgroundColor: "#3498db",
    color: "white",
    borderRadius: "4px",
    cursor: "pointer",
    textAlign: "center",
    transition: "background 0.3s ease",
    border: "none",
    fontSize: "0.9rem",
    marginTop: "0.5rem"
  },
  buttonGroup: {
    display: "flex",
    gap: "1rem",
    marginTop: "1.5rem"
  },
  submitButton: { 
    padding: "0.8rem 1.5rem",
    backgroundColor: "#27ae60",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "1rem",
    fontWeight: "500",
    flex: 1,
    transition: "background 0.3s ease"
  },
  cancelButton: {
    padding: "0.8rem 1.5rem",
    backgroundColor: "#e74c3c",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "1rem",
    fontWeight: "500",
    flex: 1,
    transition: "background 0.3s ease"
  },
  loadingContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "200px"
  },
  spinner: {
    border: "4px solid rgba(0, 0, 0, 0.1)",
    width: "36px",
    height: "36px",
    borderRadius: "50%",
    borderLeftColor: "#3498db",
    animation: "spin 1s linear infinite",
    marginBottom: "1rem"
  }
};

export default EditRecord;