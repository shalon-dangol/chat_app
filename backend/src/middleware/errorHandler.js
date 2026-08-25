/**
 * Global error handler middleware.
 * Catches unhandled errors and returns a consistent error response
 * so the client always gets a structured JSON payload.
 */
const errorHandler = (err, req, res, _next) => {
  console.error("Unhandled error:", err.stack);

  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal server error";

  return res.status(statusCode).json({
    success: false,
    message,
    data: null,
  });
};

export default errorHandler;
