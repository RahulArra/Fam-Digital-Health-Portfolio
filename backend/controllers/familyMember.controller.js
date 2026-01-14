const FamilyMember = require("../models/FamilyMember");
const HealthProfile = require("../models/HealthProfile");
const ApiError = require("../utils/ApiError");

const createFamilyMember = async (req, res, next) => {
  try {
    const { name, dateOfBirth, email, guardians } = req.body;

    if (!name || !dateOfBirth) {
      return next(new ApiError(400, "Name and date of birth are required"));
    }

    const member = await FamilyMember.create({
      familyId: req.family._id,
      name,
      dateOfBirth,
      email,
      guardians
    });

    await HealthProfile.create({
      memberId: member._id
    });

    res.status(201).json({
      message: "Family member created",
      memberId: member._id
    });
  } catch (error) {
    next(error);
  }
};

const getFamilyMembers = async (req, res, next) => {
  try {
    let members;

    if (req.role === "ADMIN") {
      members = await FamilyMember.find({
        familyId: req.family._id
      });
    } else {
      members = await FamilyMember.find({
        familyId: req.family._id,
        $or: [
          { email: req.user.email },
          { guardians: { $in: [req.familyUser.memberId] } }
        ]
      });
    }

    res.json({ members });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createFamilyMember,
  getFamilyMembers
};
