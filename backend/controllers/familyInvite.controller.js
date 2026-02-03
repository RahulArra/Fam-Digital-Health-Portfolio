// const crypto = require("crypto");
// const FamilyInvite = require("../models/familyInvite");
// const FamilyUser = require("../models/FamilyUser");
// const ApiError = require("../utils/ApiError");

// const inviteUser = async (req, res, next) => {
//   try {
//     const { email } = req.body;
//     if (!email) return next(new ApiError(400, "Email required"));

//     const token = crypto.randomBytes(32).toString("hex");

//     await FamilyInvite.create({
//       email,
//       familyId: req.family._id,
//       token,
//       expiresAt: Date.now() + 48 * 60 * 60 * 1000
//     });

//     res.json({ message: "Invite sent" });
//   } catch (error) {
//     next(error);
//   }
// };

// const acceptInvite = async (req, res, next) => {
//   try {
//     const { token } = req.body;

//     const invite = await FamilyInvite.findOne({
//       token,
//       expiresAt: { $gt: Date.now() },
//       acceptedAt: { $exists: false }
//     });

//     if (!invite) return next(new ApiError(400, "Invalid or expired invite"));

//     await FamilyUser.create({
//       userId: req.user.id,
//       familyId: invite.familyId,
//       role: invite.role
//     });

//     invite.acceptedAt = new Date();
//     await invite.save();

//     res.json({ message: "Invite accepted" });
//   } catch (error) {
//     next(error);
//   }
// };

// module.exports = {
//   inviteUser,
//   acceptInvite
// };



const crypto = require("crypto");
const FamilyInvite = require("../models/FamilyInvite");
const FamilyUser = require("../models/FamilyUser");
const ApiError = require("../utils/ApiError");
const { sendEmail } = require("../services/email.service");

const inviteUser = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) return next(new ApiError(400, "Email required"));

    const token = crypto.randomBytes(32).toString("hex");

    await FamilyInvite.create({
      email,
      familyId: req.family._id,
      token,
      expiresAt: Date.now() + 48 * 60 * 60 * 1000
    });
    const inviteUrl = `${process.env.FRONTEND_URL}/accept-invite?token=${invite.token}`;

await sendEmail({
  to: invite.email,
  subject: "You’ve been invited to join a family",
  html: `
    <p>You have been invited to join a family on Digital Health Portfolio.</p>
    <p>Click below to accept the invitation:</p>
    <a href="${inviteUrl}">Accept Invitation</a>
  `
});

    res.json({ message: "Invite sent" });
  } catch (error) {
    next(error);
  }
};

const acceptInvite = async (req, res, next) => {
  try {
    const { token } = req.body;

    const invite = await FamilyInvite.findOne({
      token,
      expiresAt: { $gt: Date.now() },
      acceptedAt: { $exists: false }
    });

    if (!invite) return next(new ApiError(400, "Invalid or expired invite"));

    await FamilyUser.create({
      userId: req.user.id,
      familyId: invite.familyId,
      role: invite.role
    });

    invite.acceptedAt = new Date();
    await invite.save();

    res.json({ message: "Invite accepted" });
  } catch (error) {
    next(error);
  }
};


const cancelInvite = async (req, res, next) => {
  try {
    const { inviteId } = req.params;

    const invite = await FamilyInvite.findById(inviteId);
    if (!invite) {
      return next(new ApiError(404, "Invite not found"));
    }

    if (invite.acceptedAt) {
      return next(new ApiError(400, "Invite already accepted"));
    }

    invite.expiresAt = new Date();
    await invite.save();

    res.json({ message: "Invite cancelled" });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  inviteUser,
  acceptInvite,
  cancelInvite
};
