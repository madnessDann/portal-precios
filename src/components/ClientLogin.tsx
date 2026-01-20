import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

export default function ClientLogin() {
  const [codigo, setCodigo] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { loginClient } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const success = await loginClient(codigo.toUpperCase().trim());

      if (success) {
        navigate('/dashboard');
      } else {
        setError('Código inválido o cliente inactivo');
      }
    } catch {
      setError('Error al validar el código. Intente nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-counsel-green via-counsel-green-light to-emerald-600 flex items-center justify-center px-4 relative overflow-hidden">
      {/* Elementos decorativos de fondo */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-counsel-gold/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
      </div>
      
      <div className="max-w-md w-full relative z-10">
        <div className="glass-effect rounded-3xl shadow-2xl p-8 md:p-10 border border-white/20">
          <div className="text-center mb-8 animate-fade-in">
            {/* Logo mejorado con animación */}
            <div className="w-24 h-24 bg-gradient-to-br from-counsel-green to-counsel-green-light rounded-full flex items-center justify-center mx-auto mb-6 border-4 border-counsel-gold shadow-lg transform hover:scale-105 transition-transform duration-300">
              <span className="text-white text-4xl font-bold text-shadow">C</span>
            </div>
            <h1 className="text-3xl font-bold text-counsel-green mb-2">
              COUNSEL LOGISTIC
            </h1>
            <p className="text-counsel-gray text-sm font-medium">
              Comercialización de Hidrocarburos
            </p>
            <div className="mt-6 h-1 w-20 bg-gradient-to-r from-transparent via-counsel-gold to-transparent mx-auto"></div>
            <p className="text-counsel-gray mt-6 text-base">
              Ingrese su código de cliente para acceder
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="codigo"
                className="block text-sm font-semibold text-counsel-gray-dark mb-3"
              >
                Código de Cliente
              </label>
              <input
                type="text"
                id="codigo"
                value={codigo}
                onChange={(e) => setCodigo(e.target.value)}
                placeholder="Ej: ABC123"
                className="input text-center text-xl tracking-widest uppercase font-semibold focus:scale-[1.02] transition-transform"
                maxLength={10}
                required
                disabled={loading}
              />
            </div>

            {error && (
              <div className="bg-gradient-to-r from-red-50 to-red-100 border-2 border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm font-medium animate-shake">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {error}
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !codigo.trim()}
              className="btn-primary w-full text-lg py-4"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Verificando...
                </span>
              ) : (
                'Acceder'
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <Link
              to="/admin/login"
              className="text-sm text-counsel-gray hover:text-counsel-green font-medium transition-colors inline-flex items-center gap-1"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              Acceso Administrativo
            </Link>
          </div>

          {/* Línea decorativa dorada mejorada */}
          <div className="mt-8 h-1 bg-gradient-to-r from-transparent via-counsel-gold to-transparent opacity-60"></div>
        </div>
      </div>
    </div>
  );
}
