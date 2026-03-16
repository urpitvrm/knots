// Centralized error handler
// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  const status = err.status || 500;
  const message = err.message || 'Server Error';
  const details = err.details || undefined;
  if (process.env.NODE_ENV !== 'test') {
    // Basic error logging
    // Avoid logging sensitive data
    // eslint-disable-next-line no-console
    console.error(`[ERROR] ${status} ${message}`, details || '');
  }
  res.status(status).json({
    success: false,
    message,
    ...(details ? { details } : {})
  });
}

module.exports = { errorHandler };
