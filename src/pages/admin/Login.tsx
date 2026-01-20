import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

export default function AdminLogin() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { loginAdmin } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const success = loginAdmin(password);

    if (success) {
      navigate('/admin');
    } else {
      setError('Contraseña incorrecta');
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
            {/* Logo mejorado */}
            <div className="w-20 h-20 bg-gradient-to-br from-counsel-green to-counsel-green-light rounded-full flex items-center justify-center mx-auto mb-6 border-4 border-counsel-gold shadow-lg transform hover:scale-105 transition-transform duration-300">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-counsel-green mb-2">
              Panel Administrativo
            </h1>
            <p className="text-counsel-gray text-sm font-medium mb-1">
              COUNSEL LOGISTIC
            </p>
            <div className="mt-4 h-1 w-20 bg-gradient-to-r from-transparent via-counsel-gold to-transparent mx-auto"></div>
            <p className="text-counsel-gray mt-6 text-base">
              Ingrese la contraseña para acceder
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-semibold text-counsel-gray-dark mb-3"
              >
                Contraseña
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="input"
                required
                autoFocus
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
              className="btn-primary w-full text-lg py-4"
            >
              Acceder
            </button>
          </form>

          <div className="mt-8 text-center">
            <Link
              to="/"
              className="text-sm text-counsel-gray hover:text-counsel-green font-medium transition-colors inline-flex items-center gap-1"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Volver al Portal
            </Link>
          </div>

          {/* Línea decorativa dorada mejorada */}
          <div className="mt-8 h-1 bg-gradient-to-r from-transparent via-counsel-gold to-transparent opacity-60"></div>
        </div>
      </div>
    </div>
  );
}
