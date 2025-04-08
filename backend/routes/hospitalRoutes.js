const express = require("express");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const HospitalRecord = require("../models/HospitalRecord");

const router = express.Router();

// Check Cloudinary Config
console.log("Cloudinary Config:", {
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Cloudinary Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
// Multer Storage (Memory)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Function to Upload Buffer to Cloudinary
const uploadToCloudinary = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: "hospital_records" },
      (error, result) => {
        if (error) {
          console.error("Cloudinary Upload Error:", error);
          return reject(new Error("Failed to upload image to Cloudinary"));
        }
        console.log("Cloudinary Upload Success:", result.secure_url);
        resolve(result.secure_url);
      }
    );
    uploadStream.end(fileBuffer);
  });
};
// POST: Upload Hospital Record with Cloudinary Image
router.post("/upload", upload.single("prescription"), async (req, res) => {
  console.log("hello");

  try {
    console.log("Received Data:", req.body);
    console.log("Received File:", req.file ? req.file.originalname : "No file received");

    if (!req.file) {
      return res.status(400).json({ error: "Image file is required!" });
    }

    // Upload to Cloudinary
    const prescriptionUrl = await uploadToCloudinary(req.file.buffer);

    // Store the record in MongoDB
    const record = new HospitalRecord({
      userId: req.body.userId,
      hospitalName: req.body.hospitalName,
      visitDate: req.body.visitDate,
      doctorName: req.body.doctorName,
      prescription: prescriptionUrl,
      diagnosis: req.body.diagnosis,
      medications: req.body.medications,
      tests: req.body.tests,
      nextAppointment: req.body.nextAppointment,
    });

    await record.save();
    res.json({ message: "Record stored successfully!", data: record });

  } catch (error) {
    console.error("Server Error:", error);
    res.status(500).json({ error: "Error storing record", details: error.message });
  }
});

// GET: Retrieve All Hospital Records
router.get("/records/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const records = await HospitalRecord.find({ userId });

    if (!records.length) {
      return res.status(404).json({ error: "No records found for this user" });
    }

    res.json({ message: "Records retrieved successfully!", data: records });
  } catch (error) {
    console.error("Error retrieving records:", error);
    res.status(500).json({ error: "Error fetching records", details: error.message });
  }
});

// GET: Retrieve a single hospital record by its ID
router.get("/records/id/:recordId", async (req, res) => {
  try {
    const { recordId } = req.params;
    const record = await HospitalRecord.findById(recordId);

    if (!record) {
      return res.status(404).json({ error: "Record not found" });
    }

    res.json({ message: "Record retrieved successfully!", data: record });
  } catch (error) {
    console.error("Error retrieving record:", error);
    res.status(500).json({ error: "Error fetching record", details: error.message });
  }
});

module.exports = router;
