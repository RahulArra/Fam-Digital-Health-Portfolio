const mongoose = require("mongoose");
const ApiError = require("./ApiError");

const validateObjectId = (id, name = "id") => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, `Invalid ${name}`);
  }
};

module.exports = validateObjectId;
