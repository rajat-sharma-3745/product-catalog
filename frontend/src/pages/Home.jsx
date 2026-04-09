import { useMemo, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import AppShell from '../components/AppShell.jsx';
import ScanModal from '../components/ScanModal.jsx';
import { useScanState } from '../hooks/useScan.js';

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
  const [uploadError, setUploadError] = useState('');
  const fileInputRef = useRef(null);
  const isMobile = useMemo(() => isLikelyMobileDevice(), []);

  const { selectedProduct, isLookingUp, scanError, setScanError, lookupCode } = useScanState();

  const isBusy = isLookingUp || isFileDecoding;

  const handleManualLookup = async () => {
    setUploadError('');
    await lookupCode(manualCode);
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
      await lookupCode(decodedText);
    } catch {
      setUploadError('Could not decode barcode from this image. Try another image or use manual entry.');
    } finally {
      try {
        await scanner.clear();
      } catch {
      }
      setIsFileDecoding(false);
    }
  };

  const handleCameraDetected = async (decodedText) => {
    setIsScanModalOpen(false);
    setUploadError('');
    await lookupCode(decodedText);
  };

  return (
    <AppShell title="Product catalog" subtitle="Scan and purchase flow">
      <section className="rounded-xl border border-neutral-200 bg-white p-4">
        <h2 className="text-sm font-medium text-neutral-800">Upload barcode image (desktop default)</h2>
        <p className="mt-1 text-xs text-neutral-600">
          Choose a barcode image to scan. This is the recommended path on laptops/desktops.
        </p>
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={isBusy}
          className="mt-3 w-full rounded-xl border border-neutral-300 px-4 py-3 text-sm font-semibold text-neutral-900 transition hover:bg-neutral-100 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isFileDecoding ? 'Decoding image...' : 'Upload image'}
        </button>
        <input
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
          className="w-full rounded-xl bg-neutral-900 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          Start camera scan
        </button>
      ) : (
        <div className="rounded-xl border border-dashed border-neutral-300 bg-white p-3 text-xs text-neutral-600">
          Camera scan is optimized for mobile devices. On desktop, use image upload or manual entry.
        </div>
      )}

      <div className="rounded-xl border border-neutral-200 bg-white p-4">
        <p className="text-sm font-medium text-neutral-800">Manual entry</p>
        <div className="mt-3 flex gap-2">
          <input
            type="text"
            placeholder="Enter barcode"
            value={manualCode}
            onChange={(event) => setManualCode(event.target.value)}
            className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-neutral-400 focus:outline-none"
          />
          <button
            type="button"
            disabled={isBusy}
            onClick={handleManualLookup}
            className="rounded-lg border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-800 hover:bg-neutral-100"
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
