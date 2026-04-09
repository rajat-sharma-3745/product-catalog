import AppShell from '../components/AppShell.jsx';

export default function Catalog() {
  return (
    <AppShell title="Catalog" subtitle="Purchases list">
      <section className="rounded-xl border border-neutral-200 bg-white p-4">
        <p className="text-sm text-neutral-600">No purchases yet.</p>
      </section>
    </AppShell>
  );
}
