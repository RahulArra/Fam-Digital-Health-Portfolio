const HealthProfile = require("../models/HealthProfile");
const ApiError = require("../utils/ApiError");

const getHealthProfile = async (req, res, next) => {
  try {
    const profile = await HealthProfile.findOne({
      memberId: req.params.memberId
    });

    if (!profile) {
      return next(new ApiError(404, "Health profile not found"));
    }

    res.json(profile);
  } catch (error) {
    next(error);
  }
};

const updateHealthProfile = async (req, res, next) => {
  try {
    const profile = await HealthProfile.findOneAndUpdate(
      { memberId: req.params.memberId },
      req.body,
      { new: true }
    );

    if (!profile) {
      return next(new ApiError(404, "Health profile not found"));
    }

    res.json(profile);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getHealthProfile,
  updateHealthProfile
};
