import { useAuth } from '../context/AuthContext';
import { useClientPrices } from '../hooks/useGoogleSheets';
import PriceTable from '../components/PriceTable';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

export default function ClientDashboard() {
  const { client, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const { prices, loading, error, lastUpdate, refetch } = useClientPrices(
    client?.codigo || ''
  );

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!client) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-counsel-gray-light to-gray-100">
      <header className="bg-gradient-to-r from-counsel-green via-counsel-green-light to-counsel-green shadow-lg sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-5 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              {/* Logo mejorado */}
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center border-2 border-counsel-gold shadow-md">
                <span className="text-counsel-green text-xl font-bold">C</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">{client.empresa}</h1>
                <p className="text-sm text-white/90">
                  Bienvenido, {client.nombre}
                </p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="text-sm text-white hover:text-white font-medium flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-white/10 transition-all duration-200"
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
              Salir
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="card p-6 md:p-8 animate-fade-in">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold text-counsel-green mb-1">
                Precios de Hidrocarburos
              </h2>
              <p className="text-sm text-counsel-gray">Consulta los precios actualizados</p>
            </div>
            <button
              onClick={refetch}
              disabled={loading}
              className="btn-secondary text-sm py-2 px-4 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              <span className="flex items-center gap-2">
                <svg
                  className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                Actualizar
              </span>
            </button>
          </div>

          <PriceTable
            prices={prices}
            loading={loading}
            error={error}
            lastUpdate={lastUpdate}
          />
        </div>

        <div className="mt-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-sm border border-gray-200">
            <span className="text-sm text-counsel-gray font-medium">Código de cliente:</span>
            <span className="font-mono bg-gradient-to-r from-counsel-green to-counsel-green-light bg-clip-text text-transparent font-bold text-lg">{client.codigo}</span>
          </div>
        </div>

        {/* Footer con marca */}
        <div className="mt-10 text-center">
          <div className="h-1 bg-gradient-to-r from-transparent via-counsel-gold to-transparent mb-4 opacity-60"></div>
          <p className="text-xs text-counsel-gray font-medium">
            COUNSEL LOGISTIC - Comercialización de Hidrocarburos
          </p>
        </div>
      </main>
    </div>
  );
}
