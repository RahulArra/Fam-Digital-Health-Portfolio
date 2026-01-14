// 1️ What familyContext.middleware Is Responsible For

// This middleware answers three critical questions for every family-scoped request:

// Which family is this request for?

// Is the logged-in user part of this family?

// What is their role in this family? (ADMIN / MEMBER)

const Family = require("../models/Family");
const FamilyUser = require("../models/FamilyUser");
const ApiError = require("../utils/ApiError");

const familyContextMiddleware = async (req, res, next) => {
  try {
    const familyId =
      req.params.familyId || req.headers["x-family-id"];

    if (!familyId) {
      return next(new ApiError(400, "Family context is required"));
    }

    const family = await Family.findById(familyId);

    if (!family) {
      return next(new ApiError(404, "Family not found"));
    }

    const familyUser = await FamilyUser.findOne({
      userId: req.user.id,
      familyId: familyId,
      leftAt: { $exists: false }
    });

    if (!familyUser) {
      return next(new ApiError(403, "Access denied for this family"));
    }

    req.family = family;
    req.familyUser = familyUser;
    req.role = familyUser.role;

    next();
  } catch (error) {
    return next(new ApiError(500, "Failed to resolve family context"));
  }
};

module.exports = familyContextMiddleware;
