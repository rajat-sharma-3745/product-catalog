import { requestJson } from './client';

export async function scanCode(code) {
  return requestJson('/api/scan', {
    method: 'POST',
    body: JSON.stringify({ code }),
  });
}

export async function createPayment(productId, amount) {
  return requestJson('/api/payments', {
    method: 'POST',
    body: JSON.stringify({ productId, amount }),
  });
}

export async function addToCatalog(productId, paymentId) {
  return requestJson('/api/catalog', {
    method: 'POST',
    body: JSON.stringify({ productId, paymentId }),
  });
}

export async function fetchCatalog() {
  return requestJson('/api/catalog', { method: 'GET' });
}
