
function normalizeCode(value = '') {
  return String(value).trim().replace(/[\s-]+/g, '');
}

function createValidationError(message, errors = []) {
  const error = new Error(message);
  error.status = 400;
  error.errors = errors;
  return error;
}

function validateScanBody(req, res, next) {
  const normalizedCode = normalizeCode(req.body?.code);

  if (!normalizedCode) {
    return next(
      createValidationError('Invalid request body', [{ field: 'code', message: 'code is required' }])
    );
  }

  req.body.code = normalizedCode;
  return next();
}

function validatePaymentBody(req, res, next) {
  const { productId, amount } = req.body ?? {};
  const errors = [];

  if (!productId || typeof productId !== 'string' || !productId.trim()) {
    errors.push({ field: 'productId', message: 'productId is required' });
  }

  if (typeof amount !== 'number' || Number.isNaN(amount)) {
    errors.push({ field: 'amount', message: 'amount must be a number' });
  }

  if (errors.length > 0) {
    return next(createValidationError('Invalid request body', errors));
  }

  req.body.productId = productId.trim();
  return next();
}

function validateCatalogBody(req, res, next) {
  const { paymentId, productId } = req.body ?? {};
  const errors = [];

  if (!paymentId || typeof paymentId !== 'string' || !paymentId.trim()) {
    errors.push({ field: 'paymentId', message: 'paymentId is required' });
  }

  if (productId !== undefined && (typeof productId !== 'string' || !productId.trim())) {
    errors.push({ field: 'productId', message: 'productId must be a non-empty string when provided' });
  }

  if (errors.length > 0) {
    return next(createValidationError('Invalid request body', errors));
  }

  req.body.paymentId = paymentId.trim();
  if (typeof productId === 'string') {
    req.body.productId = productId.trim();
  }

  return next();
}

export { normalizeCode, validateScanBody, validatePaymentBody, validateCatalogBody };
