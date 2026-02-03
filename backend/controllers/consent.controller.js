const Consent = require("../models/Consent");
const ApiError = require("../utils/ApiError");

const grantConsent = async (req, res, next) => {
  try {
    const { grantedTo, scopes, expiresAt } = req.body;

    if (!grantedTo || !scopes?.length) {
      return next(new ApiError(400, "grantedTo and scopes are required"));
    }

    const consent = await Consent.create({
      familyId: req.family._id,
      memberId: req.params.memberId,
      grantedTo,
      scopes,
      expiresAt,
      grantedBy: req.user.id
    });

    res.status(201).json(consent);
  } catch (error) {
    next(error);
  }
};

const listConsents = async (req, res, next) => {
  try {
    const consents = await Consent.find({
      memberId: req.params.memberId,
      familyId: req.family._id,
      revokedAt: { $exists: false }
    }).sort({ createdAt: -1 });

    res.json(consents);
  } catch (error) {
    next(error);
  }
};

// const revokeConsent = async (req, res, next) => {
//   try {
//     const consent = await Consent.findById(req.params.consentId);
//     if (!consent) {
//       return next(new ApiError(404, "Consent not found"));
//     }

//     consent.revokedAt = new Date();
//     await consent.save();

//     res.json({ message: "Consent revoked" });
//   } catch (error) {
//     next(error);
//   }
// };
const revokeConsent = async (req, res, next) => {
  try {
    const consent = await Consent.findById(req.params.consentId);
    if (!consent) {
      return next(new ApiError(404, "Consent not found"));
    }

    if (consent.revokedAt) {
      return next(new ApiError(400, "Consent already revoked"));
    }

    const isAdmin = req.familyUser?.role === "ADMIN";
    const isGrantor =
      consent.grantedBy?.toString() === req.user.id;

    if (!isAdmin && !isGrantor) {
      return next(new ApiError(403, "Not allowed to revoke this consent"));
    }

    consent.revokedAt = new Date();
    await consent.save();

    res.json({ message: "Consent revoked" });
  } catch (error) {
    next(error);
  }
};


module.exports = {
  grantConsent,
  listConsents,
  revokeConsent,
};
