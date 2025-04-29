import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaUpload, FaFilePdf, FaFileImage, FaTimes, FaHospital, FaUserMd, FaFileMedical, FaPills, FaFlask, FaCalendarAlt } from "react-icons/fa";
import "./UploadRecord.css";

const MedicalRecordUpload = () => {
  const [formData, setFormData] = useState({
    hospitalName: "",
    doctorName: "",
    diagnosis: "",
    medications: "",
    tests: "",
    nextAppointment: "",
    visitDate: ""
  });
  const [files, setFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files).map(file => ({
        file,
        preview: file.type === 'application/pdf' ? null : URL.createObjectURL(file),
        type: file.type.startsWith('image/') ? 'image' : 'pdf',
        name: file.name,
        size: (file.size / (1024 * 1024)).toFixed(2) + 'MB'
      }));
      setFiles(prev => [...prev, ...newFiles]);
    }
  };

  const removeFile = (index) => {
    URL.revokeObjectURL(files[index].preview);
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const formDataToSend = new FormData();
      
      Object.entries(formData).forEach(([key, value]) => {
        if (value) formDataToSend.append(key, value);
      });
      
      files.forEach(file => {
        formDataToSend.append('documents', file.file);
      });
      
      formDataToSend.append('userId', localStorage.getItem('userID'));
      
      await axios.post('http://localhost:5000/hospital/upload', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      navigate('/dashboard');
    } catch (error) {
      console.error("Error uploading record:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="medical-upload">
      <div className="medical-upload__header">
        <h1 className="medical-upload__title">Upload New Medical Record</h1>
        <div className="medical-upload__divider"></div>
      </div>
      
      <form onSubmit={handleSubmit} className="medical-upload__form">
        <div className="medical-upload__grid">
          {/* Hospital Name */}
          <div className="medical-upload__field">
            <label className="medical-upload__label">
              <FaHospital className="medical-upload__icon" />
              <input
                className="medical-upload__input"
                type="text"
                name="hospitalName"
                placeholder="Hospital Name"
                onChange={handleChange}
                required
              />
            </label>
          </div>

          {/* Visit Date */}
          <div className="medical-upload__field">
            <label className="medical-upload__label">
              <FaCalendarAlt className="medical-upload__icon" />
              <span className="medical-upload__date-label">Visit Date</span>
              <input
                className="medical-upload__input medical-upload__input--date"
                type="date"
                name="visitDate"
                onChange={handleChange} 
                required
              />
            </label>
          </div>

          {/* Doctor Name */}
          <div className="medical-upload__field">
            <label className="medical-upload__label">
              <FaUserMd className="medical-upload__icon" />
              <input
                className="medical-upload__input"
                type="text"
                name="doctorName"
                placeholder="Doctor Name"
                onChange={handleChange}
                required
              />
            </label>
          </div>

          {/* Diagnosis */}
          <div className="medical-upload__field">
            <label className="medical-upload__label">
              <FaFileMedical className="medical-upload__icon" />
              <input
                className="medical-upload__input"
                type="text"
                name="diagnosis"
                placeholder="Diagnosis"
                onChange={handleChange}
                required
              />
            </label>
          </div>

          {/* Medications */}
          <div className="medical-upload__field">
            <label className="medical-upload__label">
              <FaPills className="medical-upload__icon" />
              <input
                className="medical-upload__input"
                type="text"
                name="medications"
                placeholder="Medications"
                onChange={handleChange}
                required
              />
            </label>
          </div>

          {/* Tests */}
          <div className="medical-upload__field">
            <label className="medical-upload__label">
              <FaFlask className="medical-upload__icon" />
              <input
                className="medical-upload__input"
                type="text"
                name="tests"
                placeholder="Tests"
                onChange={handleChange}
                required
              />
            </label>
          </div>

          {/* Next Appointment */}
          <div className="medical-upload__field">
            <label className="medical-upload__label">
              <FaCalendarAlt className="medical-upload__icon" />
              <span className="medical-upload__date-label">Next Appointment</span>
              <input
                className="medical-upload__input medical-upload__input--date"
                type="date"
                name="nextAppointment"
                onChange={handleChange}  
                required
              />
            </label>
          </div>
        </div>

        {/* File Upload Section */}
        <div className="medical-upload__file-section">
          <label className="medical-upload__file-label">
            <input
              type="file"
              onChange={handleFileChange}
              multiple
              accept="image/*,.pdf"
              className="medical-upload__file-input"
            />
            <div className="medical-upload__file-button">
              <FaUpload className="medical-upload__file-icon" />
              <span>Select Documents (Images/PDFs)</span>
              <div className="medical-upload__file-hint">Max 5MB per file</div>
            </div>
          </label>
          
          <div className="medical-upload__previews">
            {files.map((file, index) => (
              <div key={index} className="medical-upload__preview" style={{ '--delay': index * 0.1 + 's' }}>
                <div className="medical-upload__preview-content">
                  {file.type === 'pdf' ? (
                    <div className="medical-upload__preview-icon">
                      <FaFilePdf className="medical-upload__preview-pdf" />
                    </div>
                  ) : (
                    <img src={file.preview} alt="Preview" className="medical-upload__preview-image" />
                  )}
                  <div className="medical-upload__preview-info">
                    <span className="medical-upload__preview-name">{file.name}</span>
                    <span className="medical-upload__preview-size">{file.size}</span>
                  </div>
                  <button 
                    type="button" 
                    onClick={() => removeFile(index)}
                    className="medical-upload__preview-remove"
                    aria-label="Remove file"
                  >
                    <FaTimes />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <button 
          type="submit" 
          className={`medical-upload__submit ${isLoading ? 'medical-upload__submit--loading' : ''}`}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <span className="medical-upload__spinner"></span>
              Uploading...
            </>
          ) : (
            'Upload Record'
          )}
        </button>
      </form>
    </div>
  );
};

export default MedicalRecordUpload;