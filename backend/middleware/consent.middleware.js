const Consent = require("../models/Consent");
const ApiError = require("../utils/ApiError");

const requireConsent = ({ grantedTo, scope }) => {
  return async (req, res, next) => {
    const consent = await Consent.findOne({
      familyId: req.family._id,
      memberId: req.params.memberId,
      grantedTo,
      scopes: scope,
      revokedAt: { $exists: false },
      $or: [
        { expiresAt: { $exists: false } },
        { expiresAt: { $gt: new Date() } }
      ]
    });

    if (!consent) {
      return next(new ApiError(403, "Valid consent required"));
    }

    next();
  };
};

module.exports = { requireConsent };




// Purpose

// Allows access only if valid consent exists for:

// Doctor

// Caregiver

// AI / ML

// Admins & guardians do NOT need consent for normal responsibilities.

// What it checks (only this)

// Target memberId

// Requested scope

// Active (not expired, not revoked) consent