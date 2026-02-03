const validateObjectId = require("../utils/validateObjectId");

const validateParamId = (paramName) => {
  return (req, res, next) => {
    try {
      validateObjectId(req.params[paramName], paramName);
      next();
    } catch (error) {
      next(error);
    }
  };
};

module.exports = { validateParamId };
