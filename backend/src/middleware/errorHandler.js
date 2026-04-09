function errorHandler(err, req, res, next) {
  const status = err.status || err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  const hasValidationErrors = err.errors !== undefined;
  if (res.headersSent) {
    return next(err);
  }

  if (hasValidationErrors) {
    return res.status(status).json({ message, errors: err.errors });
  }

  return res.status(status).json({ message });
}

export { errorHandler };
