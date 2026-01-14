const HospitalRecord = require("../models/HospitalRecord");
const ApiError = require("../utils/ApiError");

const createRecord = async (req, res, next) => {
  try {
    const { visitDate } = req.body;

    if (!visitDate) {
      return next(new ApiError(400, "visitDate is required"));
    }

    const role =
      req.role === "ADMIN"
        ? "ADMIN"
        : "GUARDIAN";

    const record = await HospitalRecord.create({
      memberId: req.params.memberId,
      ...req.body,
      createdBy: {
        role,
        userId: req.user.id
      }
    });

    res.status(201).json(record);
  } catch (error) {
    next(error);
  }
};


const getRecords = async (req, res, next) => {
  try {
    const records = await HospitalRecord.find({
      memberId: req.params.memberId
    }).sort({ visitDate: -1 });

    res.json(records);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createRecord,
  getRecords
};
