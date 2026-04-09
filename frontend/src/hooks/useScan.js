import { useCallback, useRef, useState } from 'react';
import { scanCode } from '../api/index.js';
import { ApiError } from '../api/client.js';
import { useAppState } from '../context/AppStateContext.jsx';

export function normalizeCode(value) {
  if (value === null || value === undefined) {
    return '';
  }

  return String(value).trim().replace(/[\s-]+/g, '');
}

function isSupportedBarcode(code) {
  return /^\d{8,14}$/.test(code);
}

function getScanErrorMessage(error) {
  if (error instanceof ApiError) {
    if (error.status === 404) {
      return 'Product not found. Check the barcode and try again.';
    }

    if (error.status === 400 && Array.isArray(error.details) && error.details.length > 0) {
      return error.details.map((item) => item?.message).filter(Boolean).join(' ');
    }

    return error.message || 'Scan request failed. Please try again.';
  }

  return 'Something went wrong while looking up the barcode.';
}

export function useScanState() {
  const {
    selectedProduct,
    setSelectedProduct,
    clearSelectedProduct,
    lastPayment,
    setLastPayment,
    clearLastPayment,
    markCatalogDirty,
  } = useAppState();
  const [isLookingUp, setIsLookingUp] = useState(false);
  const [scanError, setScanError] = useState('');
  const lookupInFlightRef = useRef(false);

  const lookupCode = useCallback(
    async (rawCode) => {
      const normalizedCode = normalizeCode(rawCode);

      if (!normalizedCode) {
        setScanError('Enter a barcode to continue.');
        clearSelectedProduct();
        return null;
      }

      if (!isSupportedBarcode(normalizedCode)) {
        setScanError('Enter a valid barcode (8-14 digits).');
        clearSelectedProduct();
        return null;
      }

      if (lookupInFlightRef.current) {
        return null;
      }

      lookupInFlightRef.current = true;
      setIsLookingUp(true);
      setScanError('');
      clearLastPayment();

      try {
        const response = await scanCode(normalizedCode);
        const product = response?.product ?? null;
        setSelectedProduct(product);
        return product;
      } catch (error) {
        setScanError(getScanErrorMessage(error));
        clearSelectedProduct();
        clearLastPayment();
        return null;
      } finally {
        lookupInFlightRef.current = false;
        setIsLookingUp(false);
      }
    },
    [clearLastPayment, clearSelectedProduct, setSelectedProduct]
  );

  return {
    selectedProduct,
    setSelectedProduct,
    clearSelectedProduct,
    lastPayment,
    setLastPayment,
    clearLastPayment,
    markCatalogDirty,
    isLookingUp,
    scanError,
    setScanError,
    lookupCode,
  };
}
