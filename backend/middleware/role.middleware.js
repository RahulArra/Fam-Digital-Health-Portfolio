const ApiError = require("../utils/ApiError");

const requireAdmin = (req, res, next) => {
  if (req.role !== "ADMIN") {
    return next(new ApiError(403, "Admin access required"));
  }
  next();
};

module.exports = {
  requireAdmin
};

const requireGuardianOrSelf = async (req, res, next) => {
  try {
    if (req.role === "ADMIN") {
      return next();
    }

    const memberId = req.params.memberId;
    if (!memberId) {
      return next(new ApiError(400, "Member context required"));
    }

    const member = await FamilyMember.findById(memberId);
    if (!member) {
      return next(new ApiError(404, "Family member not found"));
    }

    if (member.email && member.email === req.user.email) {
      return next();
    }

    if (
      member.guardians &&
      member.guardians.some(
        (guardianId) => guardianId.toString() === req.familyUser.memberId?.toString()
      )
    ) {
      return next();
    }

    return next(new ApiError(403, "Not authorized for this member"));
  } catch (error) {
    return next(new ApiError(500, "Permission check failed"));
  }
};

module.exports = {
  requireGuardianOrSelf
};



const preventDependentAction = async (req, res, next) => {
  const memberId = req.params.memberId;
  if (!memberId) {
    return next();
  }

  const member = await FamilyMember.findById(memberId);
  if (!member) {
    return next(new ApiError(404, "Family member not found"));
  }

  const isDependent =
    !member.email || (member.guardians && member.guardians.length > 0);

  if (isDependent && member.email === req.user.email) {
    return next(new ApiError(403, "Dependents cannot perform this action"));
  }

  next();
};

module.exports = {
  requireAdmin,
  requireGuardianOrSelf,
  preventDependentAction
};


//  requireAdmin Middleware
// Purpose (ONLY THIS)

// Allows access only if the user is ADMIN in the family.

// Uses req.role set by familyContextMiddleware

// No DB calls

// No extra logic


// When to Use

// Create / manage family

// Invite users

// Add family members

// Family settings


// router.post(
//   "/families/:familyId/members",
//   authMiddleware,
//   familyContextMiddleware,
//   requireAdmin,
//   createFamilyMember
// );
// What This Middleware Assumes
// authMiddleware already ran

// familyContextMiddleware already ran

// req.role exists

