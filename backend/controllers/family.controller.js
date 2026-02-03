// const Family = require("../models/Family");
// const FamilyUser = require("../models/FamilyUser");
// const ApiError = require("../utils/ApiError");
// const generateJoinCode = require("../utils/generateJoinCode");

// const createFamily = async (req, res, next) => {
//   try {
//     const { familyName } = req.body;
//     if (!familyName) return next(new ApiError(400, "Family name is required"));

//     let family;
//     let created = false;

//     while (!created) {
//       try {
//         family = await Family.create({
//           familyName,
//           joinCode: generateJoinCode()
//         });
//         created = true;
//       } catch (err) {
//         if (err.code !== 11000) throw err;
//       }
//     }

//     await FamilyUser.create({
//       userId: req.user.id,
//       familyId: family._id,
//       role: "ADMIN"
//     });

//     res.status(201).json({
//       message: "Family created successfully",
//       familyId: family._id
//     });
//   } catch (error) {
//     next(error);
//   }
// };

// const getMyFamilies = async (req, res, next) => {
//   try {
//     const families = await FamilyUser.find({
//       userId: req.user.id,
//       leftAt: { $exists: false }
//     }).populate("familyId");

//     res.json({
//       families: families.map((fu) => ({
//         familyId: fu.familyId._id,
//         familyName: fu.familyId.familyName,
//         role: fu.role
//       }))
//     });
//   } catch (error) {
//     next(error);
//   }
// };

// const joinFamilyByCode = async (req, res, next) => {
//   try {
//     const joinCode = req.body.joinCode?.trim().toUpperCase();
//     if (!joinCode) return next(new ApiError(400, "joinCode required"));

//     const family = await Family.findOne({ joinCode });
//     if (!family) return next(new ApiError(404, "Invalid join code"));

//     const alreadyJoined = await FamilyUser.findOne({
//       userId: req.user.id,
//       familyId: family._id,
//       leftAt: { $exists: false }
//     });

//     if (alreadyJoined) {
//       return next(new ApiError(400, "Already part of this family"));
//     }

//     await FamilyUser.create({
//       userId: req.user.id,
//       familyId: family._id,
//       role: "MEMBER"
//     });

//     res.json({
//       message: "Joined family successfully",
//       familyId: family._id,
//       familyName: family.familyName
//     });
//   } catch (error) {
//     next(error);
//   }
// };

// module.exports = {
//   createFamily,
//   getMyFamilies,
//   joinFamilyByCode
// };


const Family = require("../models/Family");
const FamilyUser = require("../models/FamilyUser");
const ApiError = require("../utils/ApiError");
const generateJoinCode = require("../utils/generateJoinCode");
// const FamilyUser = require("../models/FamilyUser");

const createFamily = async (req, res, next) => {
  try {
    const { familyName } = req.body;
    if (!familyName) return next(new ApiError(400, "Family name is required"));

    let family;
    let created = false;

    while (!created) {
      try {
        family = await Family.create({
          familyName,
          joinCode: generateJoinCode()
        });
        created = true;
      } catch (err) {
        if (err.code !== 11000) throw err;
      }
    }

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

const joinFamilyByCode = async (req, res, next) => {
  try {
    const joinCode = req.body.joinCode?.trim().toUpperCase();
    if (!joinCode) return next(new ApiError(400, "joinCode required"));

    const family = await Family.findOne({ joinCode });
    if (!family) return next(new ApiError(404, "Invalid join code"));

    const alreadyJoined = await FamilyUser.findOne({
      userId: req.user.id,
      familyId: family._id,
      leftAt: { $exists: false }
    });

    if (alreadyJoined) {
      return next(new ApiError(400, "Already part of this family"));
    }

    await FamilyUser.create({
      userId: req.user.id,
      familyId: family._id,
      role: "MEMBER"
    });

    res.json({
      message: "Joined family successfully",
      familyId: family._id,
      familyName: family.familyName
    });
  } catch (error) {
    next(error);
  }
};


const leaveFamily = async (req, res, next) => {
  try {
    const { familyId } = req.params;

    const familyUser = await FamilyUser.findOne({
      userId: req.user.id,
      familyId,
      leftAt: { $exists: false }
    });

    if (!familyUser) {
      return next(new ApiError(404, "Not part of this family"));
    }

    familyUser.leftAt = new Date();
    await familyUser.save();

    res.json({ message: "Left family successfully" });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createFamily,
  getMyFamilies,
  joinFamilyByCode,
  leaveFamily
};
