import type { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const location = useLocation();
  const { logoutFromAdmin } = useAuth();

  const navItems = [
    { path: '/admin', label: 'Dashboard', exact: true },
    { path: '/admin/clients', label: 'Clientes' },
    { path: '/admin/prices', label: 'Precios' },
    { path: '/admin/products', label: 'Productos' },
  ];

  const isActive = (path: string, exact?: boolean) => {
    if (exact) {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-counsel-gray-light to-gray-100">
      <nav className="bg-gradient-to-r from-counsel-green via-counsel-green-light to-counsel-green shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center gap-6">
              {/* Logo mejorado */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center border-2 border-counsel-gold shadow-md transform hover:rotate-6 transition-transform duration-300">
                  <span className="text-counsel-green text-lg font-bold">C</span>
                </div>
                <div>
                  <span className="text-white font-bold text-xl block">Panel Admin</span>
                  <span className="text-white/70 text-xs">Counsel Logistic</span>
                </div>
              </div>
              <div className="hidden md:flex items-baseline space-x-2 ml-4">
                {navItems.map(item => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                      isActive(item.path, item.exact)
                        ? 'bg-white/20 text-white'
                        : 'text-white/90 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Link
                to="/"
                className="hidden sm:flex text-white/90 hover:text-white text-sm font-medium transition-colors items-center gap-1 px-3 py-2 rounded-lg hover:bg-white/10"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                Ver Portal
              </Link>
              <button
                onClick={logoutFromAdmin}
                className="text-white/90 hover:text-white text-sm font-medium flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-white/10 transition-all duration-200"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
                <span className="hidden sm:inline">Salir</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {children}
      </main>

      {/* Footer mejorado */}
      <footer className="max-w-7xl mx-auto px-4 pb-8 sm:px-6 lg:px-8 mt-12">
        <div className="h-1 bg-gradient-to-r from-transparent via-counsel-gold to-transparent mb-4 opacity-60"></div>
        <p className="text-center text-xs text-counsel-gray font-medium">
          COUNSEL LOGISTIC - Comercialización de Hidrocarburos
        </p>
      </footer>
    </div>
  );
}
