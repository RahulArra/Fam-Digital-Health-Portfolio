const MedicalReport = require("../models/MedicalReport");
const ApiError = require("../utils/ApiError");

const createReport = async (req, res, next) => {
  try {
    const { reportType } = req.body;

    if (!reportType) {
      return next(new ApiError(400, "reportType is required"));
    }

    const report = await MedicalReport.create({
      familyId: req.family._id,
      memberId: req.params.memberId,
      hospitalRecordId: req.body.hospitalRecordId,
      reportType,
      file: req.body.file,
      extractedMetrics: req.body.extractedMetrics || []
    });

    res.status(201).json(report);
  } catch (error) {
    next(error);
  }
};

const getReports = async (req, res, next) => {
  try {
    const reports = await MedicalReport.find({
      memberId: req.params.memberId,
      familyId: req.family._id
    }).sort({ createdAt: -1 });

    res.json(reports);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createReport,
  getReports
};
