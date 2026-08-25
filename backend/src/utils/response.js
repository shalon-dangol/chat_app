/**
 * Standardized API response helpers.
 * Keeps controller response format consistent across all endpoints.
 */

export const sendSuccess = (res, statusCode, data, message = "Success") => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

export const sendError = (res, statusCode, message = "Internal server error") => {
  return res.status(statusCode).json({
    success: false,
    message,
    data: null,
  });
};
