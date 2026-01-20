import { useState } from 'react';
import { useProducts } from '../../hooks/useGoogleSheets';
import AdminLayout from '../../components/AdminLayout';
import ProductForm from '../../components/ProductForm';
import type { Product } from '../../types';

export default function AdminProducts() {
  const { products, loading, error, refetch, createProduct } = useProducts();
  const [showForm, setShowForm] = useState(false);
  const [formLoading, setFormLoading] = useState(false);

  const handleCreate = async (data: Product) => {
    setFormLoading(true);
    try {
      await createProduct(data);
      setShowForm(false);
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="mb-8 animate-fade-in">
        <h1 className="text-3xl font-bold text-counsel-green mb-2">Productos</h1>
        <p className="text-counsel-gray text-lg">Catálogo de hidrocarburos</p>
      </div>

      {showForm && (
        <div className="mb-6 card p-6 md:p-8 animate-fade-in">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-counsel-green to-counsel-green-light rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-counsel-green">
              Nuevo Producto
            </h2>
          </div>
          <ProductForm
            onSubmit={handleCreate}
            onCancel={() => setShowForm(false)}
            loading={formLoading}
          />
        </div>
      )}

      {error && (
        <div className="mb-6 bg-gradient-to-r from-red-50 to-red-100 border-2 border-red-200 text-red-700 px-4 py-3 rounded-lg font-medium">
          {error}
        </div>
      )}

      <div className="card overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-counsel-green mx-auto"></div>
            <p className="mt-4 text-counsel-gray font-medium">Cargando productos...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="p-12 text-center">
            <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
            <p className="mb-2 font-semibold text-counsel-gray-dark">No hay productos configurados</p>
            <p className="text-sm text-counsel-gray">
              Agregue productos en la hoja "Productos" de Google Sheets con el formato:
              <br />
              <code className="bg-counsel-gray-light px-3 py-1.5 rounded-lg border border-gray-300 font-mono text-sm mt-2 inline-block">id | nombre | descripcion</code>
            </p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-xl border-2 border-gray-100">
            <table className="min-w-full divide-y divide-gray-100">
              <thead className="table-header">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                    Nombre
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                    Descripción
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {products.map(product => (
                  <tr key={product.id} className="hover:bg-gradient-to-r hover:from-counsel-green/5 hover:to-counsel-green-light/5 transition-all duration-200">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="font-mono text-sm font-semibold bg-gradient-to-r from-counsel-green/10 to-counsel-green-light/10 px-3 py-1.5 rounded-lg border border-counsel-green/20 text-counsel-green">
                        {product.id}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap font-semibold text-counsel-gray-dark">
                      {product.nombre}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-counsel-gray font-medium">
                      {product.descripcion}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="mt-6 flex justify-between items-center">
        <div className="text-sm font-semibold text-counsel-gray">
          Total: <span className="text-counsel-green">{products.length}</span> productos
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowForm(true)}
            className="btn-primary text-sm py-3 px-6 flex items-center gap-2"
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
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
            Agregar Producto
          </button>
          <button
            onClick={refetch}
            disabled={loading}
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
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.5 : 1,
              transition: 'all 0.2s ease-in-out',
            }}
            onMouseEnter={(e) => {
              if (!loading) {
                e.currentTarget.style.backgroundColor = '#059669';
                e.currentTarget.style.color = '#ffffff';
                e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)';
              }
            }}
            onMouseLeave={(e) => {
              if (!loading) {
                e.currentTarget.style.backgroundColor = '#ffffff';
                e.currentTarget.style.color = '#059669';
                e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
              }
            }}
          >
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
          </button>
        </div>
      </div>

      <div className="mt-8 card p-6 md:p-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-gradient-to-br from-counsel-gold to-amber-400 rounded-lg flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-counsel-green">
            Productos Sugeridos
          </h2>
        </div>
        <p className="text-sm text-counsel-gray mb-4 font-medium">
          Si aún no tiene productos configurados, puede agregar estos a su hoja de Google Sheets:
        </p>
        <div className="bg-gradient-to-r from-gray-50 to-counsel-gray-light rounded-xl p-6 border-2 border-gray-200 overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left text-counsel-gray font-semibold border-b-2 border-gray-300">
                <th className="pr-6 pb-3">id</th>
                <th className="pr-6 pb-3">nombre</th>
                <th className="pb-3">descripcion</th>
              </tr>
            </thead>
            <tbody className="font-mono text-counsel-gray-dark">
              <tr className="border-b border-gray-200"><td className="pr-6 py-2">1</td><td className="pr-6 py-2">Magna</td><td className="py-2">Gasolina Regular</td></tr>
              <tr className="border-b border-gray-200"><td className="pr-6 py-2">2</td><td className="pr-6 py-2">Premium</td><td className="py-2">Gasolina Premium</td></tr>
              <tr className="border-b border-gray-200"><td className="pr-6 py-2">3</td><td className="pr-6 py-2">Diesel</td><td className="py-2">Diesel</td></tr>
              <tr className="border-b border-gray-200"><td className="pr-6 py-2">4</td><td className="pr-6 py-2">Gas LP</td><td className="py-2">Gas Licuado de Petróleo</td></tr>
              <tr><td className="pr-6 py-2">5</td><td className="pr-6 py-2">Turbosina</td><td className="py-2">Combustible de Aviación</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}
