import { useState } from 'react';
import type { Product } from '../types';

interface ProductFormProps {
  onSubmit: (data: Product) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

export default function ProductForm({
  onSubmit,
  onCancel,
  loading = false,
}: ProductFormProps) {
  const [formData, setFormData] = useState({
    id: '',
    nombre: '',
    descripcion: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label
          htmlFor="id"
          className="block text-sm font-semibold text-counsel-gray-dark mb-2"
        >
          ID del Producto
        </label>
        <input
          type="text"
          id="id"
          value={formData.id}
          onChange={e => setFormData({ ...formData, id: e.target.value })}
          className="input"
          required
          disabled={loading}
          placeholder="Ej: 1, 2, 3..."
        />
      </div>

      <div>
        <label
          htmlFor="nombre"
          className="block text-sm font-semibold text-counsel-gray-dark mb-2"
        >
          Nombre del Producto
        </label>
        <input
          type="text"
          id="nombre"
          value={formData.nombre}
          onChange={e => setFormData({ ...formData, nombre: e.target.value })}
          className="input"
          required
          disabled={loading}
          placeholder="Ej: Magna, Premium, Diesel..."
        />
      </div>

      <div>
        <label
          htmlFor="descripcion"
          className="block text-sm font-semibold text-counsel-gray-dark mb-2"
        >
          Descripción
        </label>
        <input
          type="text"
          id="descripcion"
          value={formData.descripcion}
          onChange={e => setFormData({ ...formData, descripcion: e.target.value })}
          className="input"
          required
          disabled={loading}
          placeholder="Ej: Gasolina Regular, Gasolina Premium..."
        />
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
            'Agregar Producto'
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
