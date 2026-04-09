import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Html5Qrcode } from 'html5-qrcode';
import AppShell from '../components/AppShell.jsx';
import ScanModal from '../components/ScanModal.jsx';
import { useScanState } from '../hooks/useScan.js';
import { addToCatalog, createPayment } from '../api/index.js';
import { ApiError } from '../api/client.js';

function isLikelyMobileDevice() {
  if (typeof navigator === 'undefined') {
    return false;
  }

  return /android|iphone|ipad|ipod/i.test(navigator.userAgent);
}

export default function Home() {
  const [manualCode, setManualCode] = useState('');
  const [isScanModalOpen, setIsScanModalOpen] = useState(false);
  const [isFileDecoding, setIsFileDecoding] = useState(false);
  const [isPaying, setIsPaying] = useState(false);
  const [isAddingToCatalog, setIsAddingToCatalog] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [paymentError, setPaymentError] = useState('');
  const [catalogSuccessMessage, setCatalogSuccessMessage] = useState('');
  const fileInputRef = useRef(null);
  const isMobile = useMemo(() => isLikelyMobileDevice(), []);

  const {
    selectedProduct,
    isLookingUp,
    scanError,
    setScanError,
    lookupCode,
    lastPayment,
    setLastPayment,
    clearLastPayment,
    markCatalogDirty,
  } = useScanState();

  const isBusy = isLookingUp || isFileDecoding || isPaying || isAddingToCatalog;

  const resetPaymentUiState = () => {
    setPaymentError('');
    setCatalogSuccessMessage('');
  };

  const handleLookup = async (rawCode) => {
    resetPaymentUiState();
    clearLastPayment();
    return lookupCode(rawCode);
  };

  const handleManualLookup = async () => {
    setUploadError('');
    await handleLookup(manualCode);
  };

  const handleUploadDecode = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = '';

    if (!file) {
      return;
    }

    setUploadError('');
    setScanError('');
    setIsFileDecoding(true);

    const scanner = new Html5Qrcode('file-qr-reader');
    try {
      const decodedText = await scanner.scanFile(file, true);
      await handleLookup(decodedText);
    } catch {
      setUploadError('Could not decode barcode from this image. Try another image or use manual entry.');
    } finally {
      try {
        await scanner.clear();
      } catch {
        // Ignore scanner clear errors after file decode attempts.
      }
      setIsFileDecoding(false);
    }
  };

  const handleCameraDetected = async (decodedText) => {
    setIsScanModalOpen(false);
    setUploadError('');
    await handleLookup(decodedText);
  };

  useEffect(() => {
    resetPaymentUiState();
  }, [selectedProduct?._id]);

  const resolvePaymentId = (paymentResponse) =>
    paymentResponse?.paymentId ??
    paymentResponse?.payment?._id ??
    paymentResponse?.payment?.id ??
    paymentResponse?._id ??
    null;

  const resolveTransactionRef = (paymentResponse) =>
    paymentResponse?.transactionRef ?? paymentResponse?.payment?.transactionRef ?? '';

  const handlePayment = async () => {
    if (!selectedProduct || isBusy) {
      return;
    }

    resetPaymentUiState();
    setIsPaying(true);

    try {
      const paymentResponse = await createPayment(selectedProduct._id, selectedProduct.price);
      const transactionRef = resolveTransactionRef(paymentResponse);
      const paymentId = resolvePaymentId(paymentResponse);
      const paymentStatus = paymentResponse?.status ?? paymentResponse?.payment?.status ?? 'success';

      setLastPayment({
        ...paymentResponse,
        transactionRef,
        paymentId,
        status: paymentStatus,
        productId: selectedProduct._id,
      });

      if (paymentStatus !== 'success') {
        throw new Error('Payment failed. Please try again.');
      }

      if (!paymentId) {
        throw new Error('Payment completed but payment id was missing from response.');
      }

      setIsAddingToCatalog(true);
      await addToCatalog(selectedProduct._id, paymentId);
      markCatalogDirty();
      setCatalogSuccessMessage('Added to catalog.');
    } catch (error) {
      if (error instanceof ApiError) {
        setPaymentError(error.message || 'Payment failed. Please try again.');
      } else {
        setPaymentError(error instanceof Error ? error.message : 'Payment failed. Please try again.');
      }
    } finally {
      setIsPaying(false);
      setIsAddingToCatalog(false);
    }
  };

  const hasStock =
    typeof selectedProduct?.inStock === 'number'
      ? selectedProduct.inStock > 0
      : selectedProduct?.inStock !== false;

  return (
    <AppShell title="Product catalog" subtitle="Scan and purchase flow">
      <section className="rounded-xl border border-neutral-200 bg-white p-4">
        <h2 id="upload-section-title" className="text-sm font-medium text-neutral-800">
          Upload barcode image (desktop default)
        </h2>
        <p className="mt-1 text-xs text-neutral-600">
          Choose a barcode image to scan. This is the recommended path on laptops/desktops.
        </p>
        <label htmlFor="barcode-image-upload" className="sr-only">
          Upload barcode image file
        </label>
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={isBusy}
          className="mt-3 w-full cursor-pointer rounded-xl border border-neutral-300 px-4 py-3 text-sm font-semibold text-neutral-900 transition hover:bg-neutral-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-500 focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isFileDecoding ? 'Decoding image...' : 'Upload image'}
        </button>
        <input
          id="barcode-image-upload"
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleUploadDecode}
        />
        <div id="file-qr-reader" className="hidden" />
        {uploadError ? (
          <p className="mt-3 rounded-lg border border-amber-300 bg-amber-50 px-3 py-2 text-sm text-amber-900">
            {uploadError}
          </p>
        ) : null}
      </section>

      {isMobile ? (
        <button
          type="button"
          onClick={() => setIsScanModalOpen(true)}
          disabled={isBusy}
          className="w-full cursor-pointer rounded-xl bg-neutral-900 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-neutral-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-500 focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-60"
        >
          Start camera scan
        </button>
      ) : (
        <div className="rounded-xl border border-dashed border-neutral-300 bg-white p-3 text-xs text-neutral-600">
          Camera scan is optimized for mobile devices. On desktop, use image upload or manual entry.
        </div>
      )}

      <div className="rounded-xl border border-neutral-200 bg-white p-4">
        <p id="manual-entry-title" className="text-sm font-medium text-neutral-800">
          Manual entry
        </p>
        <label htmlFor="manual-barcode-input" className="mt-3 block text-xs font-medium text-neutral-700">
          Barcode
        </label>
        <div className="mt-2 flex flex-col gap-2 sm:flex-row">
          <input
            id="manual-barcode-input"
            type="text"
            placeholder="Enter barcode"
            value={manualCode}
            onChange={(event) => setManualCode(event.target.value)}
            className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-neutral-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-500 focus-visible:ring-offset-1"
          />
          <button
            type="button"
            disabled={isBusy}
            onClick={handleManualLookup}
            className="w-full cursor-pointer rounded-lg border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-800 hover:bg-neutral-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-500 focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
          >
            {isLookingUp ? 'Looking up...' : 'Lookup'}
          </button>
        </div>
        {scanError ? (
          <p className="mt-3 rounded-lg border border-rose-300 bg-rose-50 px-3 py-2 text-sm text-rose-900">
            {scanError}
          </p>
        ) : null}
      </div>

      {selectedProduct ? (
        <section className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
          <h3 className="text-sm font-semibold text-emerald-900">Product found</h3>
          <p className="mt-2 text-sm text-emerald-900">{selectedProduct.name}</p>
          <p className="mt-1 text-xs text-emerald-800">
            Barcode: {selectedProduct.barcode} | Price: {selectedProduct.currency} {selectedProduct.price}
          </p>
          <p className="mt-1 text-xs text-emerald-800">
            {hasStock ? 'In stock' : 'Out of stock'}
          </p>

          <button
            type="button"
            onClick={handlePayment}
            disabled={isBusy || !hasStock}
            className="mt-4 w-full cursor-pointer rounded-xl bg-emerald-700 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isPaying ? 'Processing payment...' : isAddingToCatalog ? 'Adding to catalog...' : 'Pay now'}
          </button>

          {lastPayment?.transactionRef ? (
            <p className="mt-3 rounded-lg border border-emerald-300 bg-white px-3 py-2 text-xs text-emerald-900">
              Payment successful. Transaction reference: {lastPayment.transactionRef}
            </p>
          ) : null}

          {paymentError ? (
            <p className="mt-3 rounded-lg border border-rose-300 bg-rose-50 px-3 py-2 text-sm text-rose-900">
              {paymentError}
            </p>
          ) : null}

          {catalogSuccessMessage ? (
            <div className="mt-3 space-y-2 rounded-lg border border-emerald-300 bg-white px-3 py-3 text-sm text-emerald-900">
              <p>{catalogSuccessMessage}</p>
              <Link
                to="/catalog"
                className="inline-flex cursor-pointer rounded-lg border border-emerald-500 px-3 py-2 text-xs font-semibold text-emerald-800 hover:bg-emerald-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-1"
              >
                Go to Catalog
              </Link>
            </div>
          ) : null}
        </section>
      ) : null}

      <ScanModal
        isOpen={isScanModalOpen}
        onClose={() => setIsScanModalOpen(false)}
        onDetected={handleCameraDetected}
        isBusy={isBusy}
      />
    </AppShell>
  );
}
