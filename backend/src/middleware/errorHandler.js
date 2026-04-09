function errorHandler(err, req, res, next) {
  const status = err.status || err.statusCode || 500;
  const hasValidationErrors = err.errors !== undefined;
  const safeServerMessage = 'Something went wrong. Please try again.';

  if (res.headersSent) {
    return next(err);
  }

  if (status >= 500) {
    console.error('Unhandled server error:', err);
  }

  if (hasValidationErrors) {
    return res
      .status(status)
      .json({ message: err.message || 'Invalid request body', errors: err.errors });
  }

  if (status >= 500) {
    return res.status(status).json({ message: safeServerMessage });
  }

  return res.status(status).json({ message: err.message || 'Request failed' });
}

export { errorHandler };
