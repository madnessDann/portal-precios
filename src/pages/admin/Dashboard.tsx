import { useClients, useProducts, usePrices } from '../../hooks/useGoogleSheets';
import AdminLayout from '../../components/AdminLayout';
import { Link } from 'react-router-dom';

export default function AdminDashboard() {
  const { clients, loading: loadingClients } = useClients();
  const { products, loading: loadingProducts } = useProducts();
  const { prices, loading: loadingPrices } = usePrices();

  const activeClients = clients.filter(c => c.activo).length;
  const todayPrices = prices.filter(
    p => p.fecha === new Date().toISOString().split('T')[0]
  ).length;

  const StatCard = ({
    title,
    value,
    subtitle,
    link,
    loading,
  }: {
    title: string;
    value: number;
    subtitle: string;
    link: string;
    loading: boolean;
  }) => (
    <Link
      to={link}
      className="card-hover p-6 border-l-4 border-counsel-green group"
    >
      <div className="flex items-start justify-between mb-2">
        <h3 className="text-sm font-semibold text-counsel-gray uppercase tracking-wide">{title}</h3>
        <div className="w-10 h-10 bg-gradient-to-br from-counsel-green/10 to-counsel-green-light/10 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
          <svg className="w-5 h-5 text-counsel-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        </div>
      </div>
      <div className="mt-4">
        {loading ? (
          <div className="h-10 w-20 bg-gradient-to-r from-gray-200 to-gray-100 animate-pulse rounded-lg"></div>
        ) : (
          <p className="text-4xl font-bold bg-gradient-to-r from-counsel-green to-counsel-green-light bg-clip-text text-transparent">{value}</p>
        )}
      </div>
      <p className="mt-2 text-sm text-counsel-gray font-medium">{subtitle}</p>
    </Link>
  );

  return (
    <AdminLayout>
      <div className="mb-8 animate-fade-in">
        <h1 className="text-3xl font-bold text-counsel-green mb-2">Dashboard</h1>
        <p className="text-counsel-gray text-lg">Resumen del sistema</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Clientes Activos"
          value={activeClients}
          subtitle={`de ${clients.length} totales`}
          link="/admin/clients"
          loading={loadingClients}
        />
        <StatCard
          title="Productos"
          value={products.length}
          subtitle="configurados"
          link="/admin/products"
          loading={loadingProducts}
        />
        <StatCard
          title="Precios Hoy"
          value={todayPrices}
          subtitle="publicados"
          link="/admin/prices"
          loading={loadingPrices}
        />
        <StatCard
          title="Total Precios"
          value={prices.length}
          subtitle="en el sistema"
          link="/admin/prices"
          loading={loadingPrices}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-counsel-green to-counsel-green-light rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-counsel-green">
              Acciones Rápidas
            </h2>
          </div>
          <div className="space-y-3">
            <Link
              to="/admin/prices"
              className="flex items-center gap-4 p-4 bg-gradient-to-r from-counsel-green/5 to-counsel-green-light/5 text-counsel-green rounded-xl hover:from-counsel-green/10 hover:to-counsel-green-light/10 transition-all duration-200 border border-counsel-green/20 group"
            >
              <div className="w-10 h-10 bg-counsel-green rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                <svg
                  className="w-5 h-5 text-white"
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
              </div>
              <span className="font-semibold">Publicar nuevos precios</span>
            </Link>
            <Link
              to="/admin/clients"
              className="flex items-center gap-4 p-4 bg-gradient-to-r from-counsel-gold/5 to-amber-400/5 text-counsel-gold rounded-xl hover:from-counsel-gold/10 hover:to-amber-400/10 transition-all duration-200 border border-counsel-gold/20 group"
            >
              <div className="w-10 h-10 bg-counsel-gold rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                <svg
                  className="w-5 h-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                  />
                </svg>
              </div>
              <span className="font-semibold">Agregar nuevo cliente</span>
            </Link>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-counsel-green to-counsel-green-light rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-counsel-green">
              Clientes Recientes
            </h2>
          </div>
          {loadingClients ? (
            <div className="space-y-3">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-16 bg-gradient-to-r from-gray-100 to-gray-50 animate-pulse rounded-lg"></div>
              ))}
            </div>
          ) : clients.length === 0 ? (
            <div className="text-center py-8">
              <svg className="w-16 h-16 text-gray-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <p className="text-counsel-gray text-sm font-medium">No hay clientes registrados</p>
            </div>
          ) : (
            <div className="space-y-3">
              {clients.slice(0, 5).map((client, index) => (
                <div
                  key={client.codigo}
                  className="flex justify-between items-center p-4 bg-white rounded-lg border border-gray-300 hover:shadow-md transition-all duration-200"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div>
                    <p className="font-semibold text-counsel-gray-dark">{client.empresa}</p>
                    <p className="text-sm text-counsel-gray">{client.nombre}</p>
                  </div>
                  <span
                    className={`px-3 py-1 text-xs font-semibold rounded-full ${
                      client.activo
                        ? 'bg-counsel-green/10 text-counsel-green border border-counsel-green/20'
                        : 'bg-gray-100 text-counsel-gray border border-gray-200'
                    }`}
                  >
                    {client.activo ? 'Activo' : 'Inactivo'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
