import { sendError } from "../utils/response.js";

/**
 * Generic input validator middleware.
 * Takes an array of required field names and checks they exist in req.body.
 */
const inputValidator = (requiredFields) => {
  return (req, res, next) => {
    const missingFields = requiredFields.filter(
      (field) => req.body[field] === undefined || req.body[field] === ""
    );

    if (missingFields.length > 0) {
      return sendError(
        res,
        400,
        `Missing required fields: ${missingFields.join(", ")}`
      );
    }

    next();
  };
};

export default inputValidator;
