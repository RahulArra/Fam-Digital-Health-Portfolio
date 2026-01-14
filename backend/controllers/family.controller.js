const Family = require("../models/Family");
const FamilyUser = require("../models/FamilyUser");
const ApiError = require("../utils/ApiError");

const createFamily = async (req, res, next) => {
  try {
    const { familyName } = req.body;

    if (!familyName) {
      return next(new ApiError(400, "Family name is required"));
    }

    const family = await Family.create({
      familyName
    });

    await FamilyUser.create({
      userId: req.user.id,
      familyId: family._id,
      role: "ADMIN"
    });

    res.status(201).json({
      message: "Family created successfully",
      familyId: family._id
    });
  } catch (error) {
    next(error);
  }
};

const getMyFamilies = async (req, res, next) => {
  try {
    const families = await FamilyUser.find({
      userId: req.user.id,
      leftAt: { $exists: false }
    }).populate("familyId");

    res.json({
      families: families.map((fu) => ({
        familyId: fu.familyId._id,
        familyName: fu.familyId.familyName,
        role: fu.role
      }))
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createFamily,
  getMyFamilies
};
