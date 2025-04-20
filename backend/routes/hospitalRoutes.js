const express = require("express");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const HospitalRecord = require("../models/HospitalRecord");

const router = express.Router();

// Cloudinary Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
// Multer Storage (Memory)
const storage = multer.memoryStorage();
const upload = multer({ storage });

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
        resolve(result);  // ✅ Resolve full result (not just secure_url)
      }
    );
    uploadStream.end(fileBuffer);
  });
};
router.post("/upload", upload.array("prescriptions", 5), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: "At least one image is required!" });
    }
    const uploadPromises = req.files.map((file) => uploadToCloudinary(file.buffer));
    const uploadResults = await Promise.all(uploadPromises);
    const prescriptionUrls = uploadResults.map((result) => result.secure_url);
    const publicIds = uploadResults.map((result) => result.public_id);

    const record = new HospitalRecord({
      userId: req.body.userId,
      hospitalName: req.body.hospitalName,
      visitDate: req.body.visitDate,
      doctorName: req.body.doctorName,
      prescription: prescriptionUrls,
      prescriptionPublicId: publicIds,
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
router.delete('/:id', async (req, res) => {
  try {
    const record = await HospitalRecord.findById(req.params.id);
    if (!record) return res.status(404).json({ message: 'Record not found' });

    // Delete image from Cloudinary
    if (record.prescriptionPublicId) {
      await cloudinary.uploader.destroy(record.prescriptionPublicId);
    }

    // Delete the record from MongoDB
    await HospitalRecord.findByIdAndDelete(req.params.id);

    res.json({ message: 'Record and associated image deleted successfully' });
  } catch (err) {
    console.error('Error deleting record:', err);
    res.status(500).json({ message: 'Error deleting record', error: err });
  }
});

module.exports = router;
