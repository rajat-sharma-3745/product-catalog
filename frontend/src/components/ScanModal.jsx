import { useCallback, useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';

const SCANNER_ELEMENT_ID = 'camera-qr-reader';

function getCameraErrorMessage(error) {
  const text = String(error || '').toLowerCase();
  if (text.includes('permission') || text.includes('notallowed')) {
    return 'Camera permission denied. Use image upload or manual entry instead.';
  }

  return 'Unable to start camera scanner on this device. Use image upload or manual entry instead.';
}

export default function ScanModal({ isOpen, onClose, onDetected, isBusy = false }) {
  const scannerRef = useRef(null);
  const hasDetectedRef = useRef(false);
  const [cameraError, setCameraError] = useState('');
  const titleId = 'scan-modal-title';

  const stopScanner = useCallback(async () => {
    const scanner = scannerRef.current;
    if (!scanner) {
      return;
    }

    try {
      await scanner.stop();
    } catch {
      // No-op: scanner may already be stopped.
    }

    try {
      await scanner.clear();
    } catch {
      // No-op: container can already be cleaned.
    }

    scannerRef.current = null;
  }, []);

  useEffect(() => {
    if (!isOpen) {
      hasDetectedRef.current = false;
      void stopScanner();
      return undefined;
    }

    hasDetectedRef.current = false;

    const scanner = new Html5Qrcode(SCANNER_ELEMENT_ID);
    scannerRef.current = scanner;

    const startScanner = async () => {
      setCameraError('');
      try {
        await scanner.start(
          { facingMode: 'environment' },
          { fps: 10, qrbox: { width: 240, height: 140 } },
          async (decodedText) => {
            if (hasDetectedRef.current || isBusy) {
              return;
            }

            hasDetectedRef.current = true;
            await stopScanner();
            onDetected(decodedText);
          }
        );
      } catch (error) {
        setCameraError(getCameraErrorMessage(error));
      }
    };

    void startScanner();

    return () => {
      hasDetectedRef.current = false;
      void stopScanner();
    };
  }, [isOpen, isBusy, onDetected, stopScanner]);

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-30 flex items-end justify-center bg-black/40 p-3 sm:items-center sm:p-4">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="w-full max-w-md rounded-2xl bg-white p-3 shadow-xl sm:p-4"
      >
        <div className="mb-3 flex items-center justify-between">
          <h2 id={titleId} className="text-sm font-semibold text-neutral-900">
            Camera scan
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer rounded-lg border border-neutral-300 px-3 py-1 text-xs font-medium text-neutral-700 hover:bg-neutral-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-500 focus-visible:ring-offset-1"
          >
            Close
          </button>
        </div>

        <div id={SCANNER_ELEMENT_ID} className="min-h-40 rounded-lg bg-neutral-100 sm:min-h-44" />

        {cameraError ? (
          <p className="mt-3 rounded-lg border border-amber-300 bg-amber-50 px-3 py-2 text-sm text-amber-900">
            {cameraError}
          </p>
        ) : (
          <p className="mt-3 text-xs text-neutral-600">
            Point your camera at a barcode. On success, scanning stops automatically.
          </p>
        )}
      </div>
    </div>
  );
}
