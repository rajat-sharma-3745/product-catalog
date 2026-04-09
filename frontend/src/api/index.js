import { request } from './client';

export async function scanCode(code) {
  return request('/api/scan', {
    method: 'POST',
    body: JSON.stringify({ code }),
  });
}

export async function createPayment(productId, amount) {
  return request('/api/payments', {
    method: 'POST',
    body: JSON.stringify({ productId, amount }),
  });
}

export async function addToCatalog(productId, paymentId) {
  return request('/api/catalog', {
    method: 'POST',
    body: JSON.stringify({ productId, paymentId }),
  });
}

export async function fetchCatalog() {
  return request('/api/catalog', { method: 'GET' });
}
