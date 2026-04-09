import { NavLink } from 'react-router-dom';

export default function Catalog() {
  return (
    <div className="min-h-screen max-w-lg mx-auto px-4 py-6">
      <header className="flex gap-6 mb-8 border-b border-neutral-200 pb-4">
        <NavLink
          to="/"
          className={({ isActive }) =>
            isActive ? 'font-semibold text-neutral-900' : 'text-neutral-600 hover:text-neutral-900'
          }
          end
        >
          Home
        </NavLink>
        <NavLink
          to="/catalog"
          className={({ isActive }) =>
            isActive ? 'font-semibold text-neutral-900' : 'text-neutral-600 hover:text-neutral-900'
          }
        >
          Catalog
        </NavLink>
      </header>
      <h1 className="text-2xl font-semibold tracking-tight text-neutral-900">Catalog</h1>
      <p className="mt-3 text-neutral-600">Purchases list</p>
    </div>
  );
}
