import { useState, useEffect } from 'react';
import type { Client, Product, Price } from '../types';
import { getTodayDate } from '../services/googleSheets';

interface PriceFormProps {
  clients: Client[];
  products: Product[];
  onSubmit: (prices: Price[]) => Promise<void>;
  loading?: boolean;
}

export default function PriceForm({
  clients,
  products,
  onSubmit,
  loading = false,
}: PriceFormProps) {
  const [fecha, setFecha] = useState(getTodayDate());
  const [selectedClients, setSelectedClients] = useState<string[]>([]);
  const [prices, setPrices] = useState<Record<string, string>>({});
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const initialPrices: Record<string, string> = {};
    products.forEach(p => {
      initialPrices[p.id] = '';
    });
    setPrices(initialPrices);
  }, [products]);

  const handleClientToggle = (codigo: string) => {
    setSelectedClients(prev =>
      prev.includes(codigo)
        ? prev.filter(c => c !== codigo)
        : [...prev, codigo]
    );
  };

  const handleSelectAll = () => {
    const activeClients = clients.filter(c => c.activo).map(c => c.codigo);
    if (selectedClients.length === activeClients.length) {
      setSelectedClients([]);
    } else {
      setSelectedClients(activeClients);
    }
  };

  const handlePriceChange = (productId: string, value: string) => {
    setPrices(prev => ({ ...prev, [productId]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (selectedClients.length === 0) {
      setError('Seleccione al menos un cliente');
      return;
    }

    const validPrices = Object.entries(prices).filter(
      ([, value]) => value !== '' && !isNaN(parseFloat(value))
    );

    if (validPrices.length === 0) {
      setError('Ingrese al menos un precio');
      return;
    }

    const pricesToCreate: Price[] = [];

    for (const clientCode of selectedClients) {
      for (const [productId, priceValue] of validPrices) {
        pricesToCreate.push({
          fecha,
          codigo_cliente: clientCode,
          producto_id: productId,
          precio: parseFloat(priceValue),
        });
      }
    }

    try {
      await onSubmit(pricesToCreate);
      setSuccess(
        `Se publicaron ${validPrices.length} precios para ${selectedClients.length} cliente(s)`
      );
      setSelectedClients([]);
      const resetPrices: Record<string, string> = {};
      products.forEach(p => {
        resetPrices[p.id] = '';
      });
      setPrices(resetPrices);
    } catch {
      setError('Error al publicar los precios');
    }
  };

  const activeClients = clients.filter(c => c.activo);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label
          htmlFor="fecha"
          className="block text-sm font-semibold text-counsel-gray-dark mb-2"
        >
          Fecha de Vigencia
        </label>
        <input
          type="date"
          id="fecha"
          value={fecha}
          onChange={e => setFecha(e.target.value)}
          className="input"
          required
          disabled={loading}
        />
      </div>

      <div>
        <div className="flex justify-between items-center mb-3">
          <label className="block text-sm font-semibold text-counsel-gray-dark">
            Clientes ({selectedClients.length} seleccionados)
          </label>
          <button
            type="button"
            onClick={handleSelectAll}
            className="text-sm font-medium text-counsel-green hover:text-counsel-green-light transition-colors px-3 py-1 rounded-lg hover:bg-counsel-green/10"
            disabled={loading}
          >
            {selectedClients.length === activeClients.length
              ? 'Deseleccionar todos'
              : 'Seleccionar todos'}
          </button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 max-h-48 overflow-y-auto border-2 border-gray-200 rounded-lg p-4 bg-gray-50">
          {activeClients.map(client => (
            <label
              key={client.codigo}
              className="flex items-center gap-2 cursor-pointer p-2 rounded-lg hover:bg-white transition-all duration-200 border border-transparent hover:border-counsel-green/20"
            >
              <input
                type="checkbox"
                checked={selectedClients.includes(client.codigo)}
                onChange={() => handleClientToggle(client.codigo)}
                className="h-5 w-5 text-counsel-green focus:ring-counsel-green border-gray-300 rounded cursor-pointer"
                disabled={loading}
              />
              <span className="text-sm font-medium text-counsel-gray-dark truncate" title={client.empresa}>
                {client.empresa}
              </span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-counsel-gray-dark mb-3">
          Precios por Producto (MXN/L)
        </label>
        <div className="space-y-3 bg-gray-50 p-4 rounded-lg border-2 border-gray-200">
          {products.map(product => (
            <div key={product.id} className="flex items-center gap-4 p-3 bg-white rounded-lg border border-gray-200 hover:border-counsel-green/30 transition-colors">
              <div className="w-32 text-sm font-semibold text-counsel-gray-dark">
                {product.nombre}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-counsel-gray">$</span>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={prices[product.id] || ''}
                  onChange={e => handlePriceChange(product.id, e.target.value)}
                  placeholder="0.00"
                  className="w-32 px-3 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-counsel-green focus:border-counsel-green transition-all"
                  disabled={loading}
                />
              </div>
              <span className="text-sm text-counsel-gray flex-1">{product.descripcion}</span>
            </div>
          ))}
        </div>
      </div>

      {error && (
        <div className="bg-gradient-to-r from-red-50 to-red-100 border-2 border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm font-medium">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {error}
          </div>
        </div>
      )}

      {success && (
        <div className="bg-gradient-to-r from-counsel-green/10 to-counsel-green-light/10 border-2 border-counsel-green/20 text-counsel-green px-4 py-3 rounded-lg text-sm font-medium">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {success}
          </div>
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Publicando...
          </span>
        ) : (
          'Publicar Precios'
        )}
      </button>
    </form>
  );
}
