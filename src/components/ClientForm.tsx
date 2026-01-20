import { useState, useEffect } from 'react';
import type { Client } from '../types';

interface ClientFormProps {
  client?: Client | null;
  onSubmit: (data: Omit<Client, 'codigo'>) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

export default function ClientForm({
  client,
  onSubmit,
  onCancel,
  loading = false,
}: ClientFormProps) {
  const [formData, setFormData] = useState({
    nombre: '',
    empresa: '',
    activo: true,
  });

  useEffect(() => {
    if (client) {
      setFormData({
        nombre: client.nombre,
        empresa: client.empresa,
        activo: client.activo,
      });
    }
  }, [client]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label
          htmlFor="nombre"
          className="block text-sm font-semibold text-counsel-gray-dark mb-2"
        >
          Nombre del Contacto
        </label>
        <input
          type="text"
          id="nombre"
          value={formData.nombre}
          onChange={e => setFormData({ ...formData, nombre: e.target.value })}
          className="input"
          required
          disabled={loading}
        />
      </div>

      <div>
        <label
          htmlFor="empresa"
          className="block text-sm font-semibold text-counsel-gray-dark mb-2"
        >
          Empresa
        </label>
        <input
          type="text"
          id="empresa"
          value={formData.empresa}
          onChange={e => setFormData({ ...formData, empresa: e.target.value })}
          className="input"
          required
          disabled={loading}
        />
      </div>

      <div className="flex items-center p-4 bg-gradient-to-r from-counsel-green/5 to-counsel-green-light/5 rounded-lg border border-counsel-green/20">
        <input
          type="checkbox"
          id="activo"
          checked={formData.activo}
          onChange={e => setFormData({ ...formData, activo: e.target.checked })}
          className="h-5 w-5 text-counsel-green focus:ring-counsel-green border-gray-300 rounded cursor-pointer"
          disabled={loading}
        />
        <label htmlFor="activo" className="ml-3 text-sm font-medium text-counsel-gray-dark cursor-pointer">
          Cliente activo
        </label>
      </div>

      <div className="flex gap-3 pt-4">
        <button
          type="submit"
          disabled={loading}
          className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Guardando...
            </span>
          ) : (
            client ? 'Actualizar' : 'Crear Cliente'
          )}
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
          className="px-6 py-3 border-2 border-gray-300 rounded-lg text-counsel-gray-dark hover:bg-gray-50 font-medium transition-all duration-200 disabled:opacity-50"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}
