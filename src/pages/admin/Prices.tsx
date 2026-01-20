import { useState } from 'react';
import { useClients, useProducts, usePrices } from '../../hooks/useGoogleSheets';
import AdminLayout from '../../components/AdminLayout';
import PriceForm from '../../components/PriceForm';
import type { Price } from '../../types';

export default function AdminPrices() {
  const { clients, loading: loadingClients } = useClients();
  const { products, loading: loadingProducts } = useProducts();
  const { prices, loading: loadingPrices, createPrices, refetch } = usePrices();
  const [formLoading, setFormLoading] = useState(false);
  const [filterDate, setFilterDate] = useState('');
  const [filterClient, setFilterClient] = useState('');

  const handlePublishPrices = async (newPrices: Price[]) => {
    setFormLoading(true);
    try {
      await createPrices(newPrices);
    } finally {
      setFormLoading(false);
    }
  };

  const filteredPrices = prices.filter(p => {
    const matchesDate = filterDate ? p.fecha === filterDate : true;
    const matchesClient = filterClient ? p.codigo_cliente === filterClient : true;
    return matchesDate && matchesClient;
  });

  const getProductName = (productId: string) => {
    const product = products.find(p => p.id === productId);
    return product?.nombre || productId;
  };

  const getClientName = (codigo: string) => {
    const client = clients.find(c => c.codigo === codigo);
    return client?.empresa || codigo;
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
    }).format(price);
  };

  const uniqueDates = [...new Set(prices.map(p => p.fecha))].sort().reverse();

  const loading = loadingClients || loadingProducts || loadingPrices;

  return (
    <AdminLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-counsel-green">Precios</h1>
        <p className="text-counsel-gray">Publicar y consultar precios</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card p-6 md:p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-counsel-green to-counsel-green-light rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-counsel-green">
              Publicar Nuevos Precios
            </h2>
          </div>
          {loading ? (
            <div className="py-12 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-counsel-green mx-auto"></div>
              <p className="mt-4 text-counsel-gray font-medium">Cargando datos...</p>
            </div>
          ) : (
            <PriceForm
              clients={clients}
              products={products}
              onSubmit={handlePublishPrices}
              loading={formLoading}
            />
          )}
        </div>

        <div className="card p-6 md:p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-counsel-green to-counsel-green-light rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-counsel-green">
              Historial de Precios
            </h2>
          </div>

          <div className="flex gap-4 mb-4">
            <div className="flex-1">
              <label className="block text-sm text-counsel-gray mb-1">Fecha</label>
              <select
                value={filterDate}
                onChange={e => setFilterDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-counsel-green focus:border-transparent"
              >
                <option value="">Todas las fechas</option>
                {uniqueDates.map(date => (
                  <option key={date} value={date}>
                    {date}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex-1">
              <label className="block text-sm text-counsel-gray mb-1">Cliente</label>
              <select
                value={filterClient}
                onChange={e => setFilterClient(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-counsel-green focus:border-transparent"
              >
                <option value="">Todos los clientes</option>
                {clients.map(client => (
                  <option key={client.codigo} value={client.codigo}>
                    {client.empresa}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="overflow-hidden rounded-xl border-2 border-gray-100">
            {loadingPrices ? (
              <div className="p-12 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-counsel-green mx-auto"></div>
                <p className="mt-4 text-counsel-gray font-medium">Cargando...</p>
              </div>
            ) : filteredPrices.length === 0 ? (
              <div className="p-12 text-center">
                <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p className="text-counsel-gray font-medium">No hay precios que mostrar</p>
              </div>
            ) : (
              <div className="max-h-96 overflow-y-auto">
                <table className="min-w-full divide-y divide-gray-100">
                  <thead className="table-header sticky top-0">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-bold text-white uppercase">
                        Fecha
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-bold text-white uppercase">
                        Cliente
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-bold text-white uppercase">
                        Producto
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-bold text-white uppercase">
                        Precio
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-100">
                    {filteredPrices.slice(0, 100).map((price, index) => (
                      <tr key={`${price.fecha}-${price.codigo_cliente}-${price.producto_id}-${index}`} className="hover:bg-gradient-to-r hover:from-counsel-green/5 hover:to-counsel-green-light/5 transition-all duration-200">
                        <td className="px-4 py-3 text-sm font-medium text-counsel-gray">
                          {price.fecha}
                        </td>
                        <td className="px-4 py-3 text-sm font-semibold text-counsel-gray-dark">
                          {getClientName(price.codigo_cliente)}
                        </td>
                        <td className="px-4 py-3 text-sm font-semibold text-counsel-gray-dark">
                          {getProductName(price.producto_id)}
                        </td>
                        <td className="px-4 py-3 text-sm text-right font-bold bg-gradient-to-r from-counsel-gold to-amber-500 bg-clip-text text-transparent">
                          {formatPrice(price.precio)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div className="mt-3 flex justify-between items-center text-sm text-counsel-gray">
            <span>
              Mostrando {Math.min(filteredPrices.length, 100)} de {filteredPrices.length}
            </span>
            <button
              onClick={refetch}
              disabled={loadingPrices}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.75rem 1.5rem',
                fontSize: '0.875rem',
                fontWeight: '600',
                borderRadius: '0.5rem',
                border: '2px solid',
                borderColor: '#059669',
                backgroundColor: '#ffffff',
                color: '#059669',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                cursor: loadingPrices ? 'not-allowed' : 'pointer',
                opacity: loadingPrices ? 0.5 : 1,
                transition: 'all 0.2s ease-in-out',
              }}
              onMouseEnter={(e) => {
                if (!loadingPrices) {
                  e.currentTarget.style.backgroundColor = '#059669';
                  e.currentTarget.style.color = '#ffffff';
                  e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)';
                }
              }}
              onMouseLeave={(e) => {
                if (!loadingPrices) {
                  e.currentTarget.style.backgroundColor = '#ffffff';
                  e.currentTarget.style.color = '#059669';
                  e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
                }
              }}
            >
              <svg
                className={`w-4 h-4 ${loadingPrices ? 'animate-spin' : ''}`}
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
            </button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
