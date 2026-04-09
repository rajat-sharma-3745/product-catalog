import { NavLink } from 'react-router-dom';

const navLinkClassName = ({ isActive }) =>
  [
    'rounded-lg px-3 py-2 text-sm font-medium transition-colors',
    isActive ? 'bg-neutral-900 text-white' : 'text-neutral-700 hover:bg-neutral-200',
  ].join(' ');

export default function AppShell({ title, subtitle, children, footer }) {
  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="mx-auto flex min-h-screen w-full max-w-lg flex-col px-4 py-5">
        <header className="sticky top-0 z-10 mb-6 rounded-xl border border-neutral-200 bg-white/95 p-3 backdrop-blur">
          <nav className="flex items-center gap-2">
            <NavLink to="/" className={navLinkClassName} end>
              Home
            </NavLink>
            <NavLink to="/catalog" className={navLinkClassName}>
              Catalog
            </NavLink>
          </nav>
        </header>

        <main className="flex-1">
          <h1 className="text-2xl font-semibold tracking-tight text-neutral-900">{title}</h1>
          {subtitle ? <p className="mt-2 text-sm text-neutral-600">{subtitle}</p> : null}
          <div className="mt-6 space-y-4">{children}</div>
        </main>

        {footer ? <footer className="pt-4">{footer}</footer> : null}
      </div>
    </div>
  );
}
