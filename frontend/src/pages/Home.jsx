import AppShell from '../components/AppShell.jsx';

export default function Home() {
  return (
    <AppShell title="Product catalog" subtitle="Scan and purchase flow">
      <section className="rounded-xl border border-dashed border-neutral-300 bg-white p-4">
        <h2 className="text-sm font-medium text-neutral-800">Viewfinder area</h2>
        <div className="mt-3 h-44 rounded-lg bg-neutral-100" />
      </section>

      <button
        type="button"
        className="w-full rounded-xl bg-neutral-900 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-neutral-800"
      >
        Start scan
      </button>

      <div className="rounded-xl border border-neutral-200 bg-white p-4">
        <p className="text-sm font-medium text-neutral-800">Manual entry</p>
        <div className="mt-3 flex gap-2">
          <input
            type="text"
            placeholder="Enter barcode"
            className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-neutral-400 focus:outline-none"
          />
          <button
            type="button"
            className="rounded-lg border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-800 hover:bg-neutral-100"
          >
            Lookup
          </button>
        </div>
      </div>
    </AppShell>
  );
}
