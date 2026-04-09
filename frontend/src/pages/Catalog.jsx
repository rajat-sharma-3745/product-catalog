import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchCatalog } from '../api/index.js';
import AppShell from '../components/AppShell.jsx';
import { useAppState } from '../context/AppStateContext.jsx';

function normalizeCatalogItems(payload) {
  if (Array.isArray(payload)) {
    return payload;
  }

  if (Array.isArray(payload?.items)) {
    return payload.items;
  }

  if (Array.isArray(payload?.catalog)) {
    return payload.catalog;
  }

  if (Array.isArray(payload?.data)) {
    return payload.data;
  }

  return [];
}

function resolveCatalogRow(item) {
  const product =
    item?.product && typeof item.product === 'object'
      ? item.product
      : item?.productId && typeof item.productId === 'object'
        ? item.productId
        : null;
  const payment =
    item?.payment && typeof item.payment === 'object'
      ? item.payment
      : item?.paymentId && typeof item.paymentId === 'object'
        ? item.paymentId
        : null;

  const name = product?.name ?? item?.productName ?? 'Unknown product';
  const currency = product?.currency ?? item?.currency ?? payment?.currency ?? '';
  const price = product?.price ?? item?.price ?? payment?.amount ?? null;
  const transactionRef = item?.transactionRef ?? payment?.transactionRef ?? '';
  const purchasedAt = item?.purchasedAt ?? item?.createdAt ?? payment?.createdAt ?? null;

  return {
    id: item?._id ?? item?.id ?? `${name}-${transactionRef}-${purchasedAt ?? 'na'}`,
    name,
    currency,
    price,
    transactionRef,
    purchasedAt,
  };
}

function formatDate(value) {
  if (!value) {
    return 'Date unavailable';
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return 'Date unavailable';
  }

  return date.toLocaleString();
}

function formatPrice(currency, amount) {
  if (typeof amount !== 'number' || Number.isNaN(amount)) {
    return 'Price unavailable';
  }

  const currencyUpper = String(currency || '').toUpperCase();
  if (currencyUpper === 'INR') {
    return `₹${amount}`;
  }

  if (!currencyUpper) {
    return String(amount);
  }

  return `${currencyUpper} ${amount}`;
}

export default function Catalog() {
  const { catalogRefresh } = useAppState();
  const [catalogItems, setCatalogItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRetrying, setIsRetrying] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const loadCatalog = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage('');

    try {
      const response = await fetchCatalog();
      setCatalogItems(normalizeCatalogItems(response).map(resolveCatalogRow));
    } catch {
      setErrorMessage('Unable to load catalog right now. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadCatalog();
  }, [loadCatalog, catalogRefresh]);

  const hasItems = useMemo(() => catalogItems.length > 0, [catalogItems.length]);

  return (
    <AppShell title="Catalog" subtitle="Purchases list">
      <section className="rounded-xl border border-neutral-200 bg-white p-4">
        {isLoading ? <p className="text-sm text-neutral-600">Loading purchases...</p> : null}

        {!isLoading && errorMessage ? (
          <div className="space-y-3">
            <p className="rounded-lg border border-rose-300 bg-rose-50 px-3 py-2 text-sm text-rose-900">{errorMessage}</p>
            <button
              type="button"
              onClick={async () => {
                setIsRetrying(true);
                try {
                  await loadCatalog();
                } finally {
                  setIsRetrying(false);
                }
              }}
              disabled={isRetrying}
              className="cursor-pointer rounded-lg border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-800 hover:bg-neutral-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-500 focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isRetrying ? 'Retrying...' : 'Retry'}
            </button>
          </div>
        ) : null}

        {!isLoading && !errorMessage && !hasItems ? (
          <div className="space-y-3">
            <p className="text-sm text-neutral-600">No purchases yet.</p>
            <Link
              to="/"
              className="inline-flex cursor-pointer rounded-lg border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-800 transition hover:bg-neutral-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-500 focus-visible:ring-offset-1"
            >
              Back to scan
            </Link>
          </div>
        ) : null}

        {!isLoading && !errorMessage && hasItems ? (
          <ul className="space-y-3">
            {catalogItems.map((item) => (
              <li key={item.id} className="rounded-lg border border-neutral-200 bg-neutral-50 p-3">
                <p className="text-base font-semibold text-neutral-900">{item.name}</p>
                <p className="mt-1 text-sm font-medium text-neutral-800">{formatPrice(item.currency, item.price)}</p>
                <p className="mt-1 text-xs text-neutral-500">{formatDate(item.purchasedAt)}</p>
                {item.transactionRef ? (
                  <p className="mt-1 text-xs text-neutral-500">
                    Ref: {item.transactionRef.slice(Math.max(0, item.transactionRef.length - 6))}
                  </p>
                ) : null}
              </li>
            ))}
          </ul>
        ) : null}
      </section>
    </AppShell>
  );
}
