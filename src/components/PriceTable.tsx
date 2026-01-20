import type { ClientPrice } from '../types';

interface PriceTableProps {
  prices: ClientPrice[];
  loading: boolean;
  error: string | null;
  lastUpdate: string | null;
}

export default function PriceTable({ prices, loading, error, lastUpdate }: PriceTableProps) {
  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-counsel-green"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-600 px-6 py-4 rounded-lg">
        <p className="font-medium">Error al cargar los precios</p>
        <p className="text-sm mt-1">{error}</p>
      </div>
    );
  }

  if (prices.length === 0) {
    return (
      <div className="bg-counsel-gray-light border border-counsel-gold/30 text-counsel-gray-dark px-6 py-4 rounded-lg">
        <p className="font-medium">Sin precios disponibles</p>
        <p className="text-sm mt-1">No hay precios publicados para su cuenta.</p>
      </div>
    );
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
    }).format(price);
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr + 'T00:00:00');
    return date.toLocaleDateString('es-MX', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Filtrar para mostrar solo el último precio de cada producto
  // Agrupar por producto_id y tomar el último de cada grupo
  const getLatestPricePerProduct = () => {
    const priceMap = new Map<string, ClientPrice>();
    
    // Recorrer los precios en orden inverso para asegurar que el último publicado se mantenga
    // Esto garantiza que si hay múltiples precios del mismo producto en el mismo día,
    // solo se muestre el último publicado (el último en el array)
    for (let i = prices.length - 1; i >= 0; i--) {
      const price = prices[i];
      if (!priceMap.has(price.producto_id)) {
        priceMap.set(price.producto_id, price);
      }
    }
    
    return Array.from(priceMap.values());
  };

  const uniquePrices = getLatestPricePerProduct();

  return (
    <div>
      {lastUpdate && (
        <div className="mb-6 p-4 bg-gradient-to-r from-counsel-green/5 to-counsel-green-light/5 rounded-lg border border-counsel-green/20">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-counsel-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-sm text-counsel-gray font-medium">Precios vigentes:</span>
            <span className="font-semibold text-counsel-green">{formatDate(lastUpdate)}</span>
          </div>
        </div>
      )}

      <div className="overflow-hidden rounded-xl border-2 border-gray-100 shadow-sm">
        <table className="min-w-full divide-y divide-gray-100">
          <thead className="table-header">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                Producto
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                Descripción
              </th>
              <th className="px-6 py-4 text-right text-xs font-bold text-white uppercase tracking-wider">
                Precio
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {uniquePrices.map((price, index) => (
              <tr 
                key={`${price.producto_id}-${index}`} 
                className="hover:bg-gradient-to-r hover:from-counsel-green/5 hover:to-counsel-green-light/5 transition-all duration-200 group"
              >
                <td className="px-6 py-5 whitespace-nowrap">
                  <span className="font-semibold text-counsel-gray-dark text-base">
                    {price.producto_nombre || price.producto_id}
                  </span>
                </td>
                <td className="px-6 py-5 whitespace-nowrap text-counsel-gray">
                  {price.producto_descripcion || '-'}
                </td>
                <td className="px-6 py-5 whitespace-nowrap text-right">
                  <div className="flex items-center justify-end gap-2">
                    <span className="text-2xl font-bold bg-gradient-to-r from-counsel-gold to-amber-500 bg-clip-text text-transparent">
                      {formatPrice(price.precio)}
                    </span>
                    <span className="text-sm text-counsel-gray font-medium">/L</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
