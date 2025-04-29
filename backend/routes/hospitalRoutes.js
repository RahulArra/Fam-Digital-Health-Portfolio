const express = require("express");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const HospitalRecord = require("../models/HospitalRecord");
const mongoose = require("mongoose")
const router = express.Router();

// Cloudinary Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Multer Configuration
const storage = multer.memoryStorage();
const upload = multer({ 
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
    files: 5 // Max 5 files
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/') || file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only image and PDF files are allowed!'), false);
    }
  }
});

/**
 * Uploads file buffer to Cloudinary
 * @param {Buffer} fileBuffer 
 * @returns {Promise<Object>} Cloudinary upload result
 */
const uploadToCloudinary = async (fileBuffer, type = 'image') => {
  try {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { 
          folder: "hospital_records",
          resource_type: type === 'pdf' ? 'raw' : 'image'
        },
        (error, result) => {
          if (error) {
            console.error("Cloudinary Upload Error:", error);
            return reject(new Error("Failed to upload file to Cloudinary"));
          }
          resolve(result);
        }
      );
      uploadStream.end(fileBuffer);
    });
  } catch (error) {
    console.error("Upload to Cloudinary failed:", error);
    throw error;
  }
};


/**
 * POST /upload - Upload hospital records with prescriptions
 */
router.post("/upload", upload.array("documents", 5), async (req, res) => {
  try {
    // Validate required fields
    const requiredFields = ['userId', 'hospitalName', 'visitDate'];
    const missingFields = requiredFields.filter(field => !req.body[field]);
    
    if (missingFields.length > 0) {
      return res.status(400).json({ 
        error: "Missing required fields", 
        missingFields 
      });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: "At least one document is required" });
    }

    // Upload files to Cloudinary
    const uploadPromises = req.files.map(file => {
      const type = file.mimetype === 'application/pdf' ? 'pdf' : 'image';
      return uploadToCloudinary(file.buffer, type);
    });
    const uploadResults = await Promise.all(uploadPromises);

    // Create new record
    const record = new HospitalRecord({
      userId: req.body.userId,
      hospitalName: req.body.hospitalName,
      visitDate: req.body.visitDate,
      doctorName: req.body.doctorName,
      prescription: uploadResults.map(result => result.secure_url),
      prescriptionPublicId: uploadResults.map(result => result.public_id),
      diagnosis: req.body.diagnosis,
      medications: req.body.medications,
      tests: req.body.tests,
      nextAppointment: req.body.nextAppointment,
    });

    await record.save();
    
    res.status(201).json({ 
      success: true,
      message: "Record created successfully",
      data: record 
    });

  } catch (error) {
    console.error("Error in /upload:", error);
    res.status(500).json({ 
      success: false,
      error: "Internal server error",
      details: error.message 
    });
  }
});

/**
 * GET /records/:userId - Get all records for a user
 */
router.get("/records/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const records = await HospitalRecord.find({ userId })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ visitDate: -1 });

    const count = await HospitalRecord.countDocuments({ userId });

    if (!records.length) {
      return res.status(404).json({ 
        success: false,
        error: "No records found for this user" 
      });
    }

    res.json({
      success: true,
      message: "Records retrieved successfully",
      data: records,
      totalPages: Math.ceil(count / limit),
      currentPage: page
    });

  } catch (error) {
    console.error("Error in /records/:userId:", error);
    res.status(500).json({ 
      success: false,
      error: "Internal server error",
      details: error.message 
    });
  }
});

/**
 * GET /records/id/:recordId - Get a single record by ID
 */
router.get("/records/id/:recordId", async (req, res) => {
  try {
    const { recordId } = req.params;
    const record = await HospitalRecord.findById(recordId);

    if (!record) {
      return res.status(404).json({ 
        success: false,
        error: "Record not found" 
      });
    }

    res.json({ 
      success: true,
      message: "Record retrieved successfully",
      data: record 
    });

  } catch (error) {
    console.error("Error in /records/id/:recordId:", error);
    res.status(500).json({ 
      success: false,
      error: "Internal server error",
      details: error.message 
    });
  }
});

/**
 * DELETE /:id - Delete a record
 */
router.delete('/:id', async (req, res) => {
  try {
    const record = await HospitalRecord.findById(req.params.id);
    
    if (!record) {
      return res.status(404).json({ 
        success: false,
        message: 'Record not found' 
      });
    }

    // Delete images from Cloudinary if they exist
    if (record.prescriptionPublicId && record.prescriptionPublicId.length > 0) {
      await cloudinary.api.delete_resources(record.prescriptionPublicId);
    }

    await HospitalRecord.findByIdAndDelete(req.params.id);

    res.json({ 
      success: true,
      message: 'Record and associated images deleted successfully' 
    });

  } catch (error) {
    console.error('Error in DELETE /:id:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error deleting record', 
      error: error.message 
    });
  }
});
/**
 * PUT /update/:id - Update a hospital record
 * @param {string} id - Record ID to update
 * @body {Object} - Fields to update (hospitalName, doctorName, etc.)
 * @files {Array} - Optional document files to upload
 */
router.put("/update/:id", upload.array("documents", 5), async (req, res) => {
  try {
    const { id } = req.params;
    
    // Validate ID format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ 
        success: false,
        error: "Invalid record ID format" 
      });
    }

    const record = await HospitalRecord.findById(id);
    
    if (!record) {
      return res.status(404).json({ 
        success: false,
        error: "Record not found" 
      });
    }

    // Handle image updates if files are uploaded
    if (req.files && req.files.length > 0) {
      try {
        // Delete old images from Cloudinary if they exist
        if (record.prescriptionPublicId && record.prescriptionPublicId.length > 0) {
          await cloudinary.api.delete_resources(record.prescriptionPublicId);
        }
        
        // Upload new images
        const uploadPromises = req.files.map(file => 
          uploadToCloudinary(file.buffer)
        );
        const uploadResults = await Promise.all(uploadPromises);
        
        record.prescription = uploadResults.map(result => result.secure_url);
        record.prescriptionPublicId = uploadResults.map(result => result.public_id);
      } catch (uploadError) {
        console.error("Error handling file uploads:", uploadError);
        return res.status(500).json({
          success: false,
          error: "Failed to process document uploads",
          details: uploadError.message
        });
      }
    }

    // Update other fields with validation
    const updateFields = {
      hospitalName: req.body.hospitalName,
      doctorName: req.body.doctorName,
      diagnosis: req.body.diagnosis,
      medications: req.body.medications,
      tests: req.body.tests,
      nextAppointment: req.body.nextAppointment,
      visitDate: req.body.visitDate
    };

    // Validate and sanitize date fields if present
    if (updateFields.visitDate) {
      if (isNaN(Date.parse(updateFields.visitDate))) {
        return res.status(400).json({
          success: false,
          error: "Invalid visit date format"
        });
      }
      // Convert to ISO format for consistency
      updateFields.visitDate = new Date(updateFields.visitDate).toISOString();
    }

    if (updateFields.nextAppointment) {
      if (isNaN(Date.parse(updateFields.nextAppointment))) {
        return res.status(400).json({
          success: false,
          error: "Invalid next appointment date format"
        });
      }
      updateFields.nextAppointment = new Date(updateFields.nextAppointment).toISOString();
    }

    // Apply updates
    Object.keys(updateFields).forEach(field => {
      if (updateFields[field] !== undefined) {
        record[field] = updateFields[field];
      }
    });

    // Validate the updated record before saving
    try {
      await record.validate();
    } catch (validationError) {
      return res.status(400).json({
        success: false,
        error: "Validation failed",
        details: validationError.errors
      });
    }

    const updatedRecord = await record.save();
    
    res.json({ 
      success: true,
      message: "Record updated successfully", 
      data: updatedRecord 
    });

  } catch (error) {
    console.error("Error in PUT /update/:id:", error);
    res.status(500).json({ 
      success: false,
      error: "Internal server error",
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

module.exports = router;