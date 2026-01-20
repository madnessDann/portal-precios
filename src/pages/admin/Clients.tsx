import { useState } from 'react';
import { useClients } from '../../hooks/useGoogleSheets';
import AdminLayout from '../../components/AdminLayout';
import ClientForm from '../../components/ClientForm';
import type { Client } from '../../types';

export default function AdminClients() {
  const { clients, loading, error, createClient, editClient, refetch } = useClients();
  const [showForm, setShowForm] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  const [newClientCode, setNewClientCode] = useState<string | null>(null);

  const handleCreate = async (data: Omit<Client, 'codigo'>) => {
    setFormLoading(true);
    try {
      const codigo = await createClient(data);
      setNewClientCode(codigo);
      setShowForm(false);
    } finally {
      setFormLoading(false);
    }
  };

  const handleEdit = async (data: Omit<Client, 'codigo'>) => {
    if (!editingClient) return;
    setFormLoading(true);
    try {
      await editClient(editingClient.codigo, data);
      setEditingClient(null);
    } finally {
      setFormLoading(false);
    }
  };

  const handleToggleActive = async (client: Client) => {
    await editClient(client.codigo, { activo: !client.activo });
  };

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-counsel-green">Clientes</h1>
          <p className="text-counsel-gray">Gestión de clientes del sistema</p>
        </div>
        <button
          onClick={() => {
            setShowForm(true);
            setEditingClient(null);
          }}
          className="btn-primary flex items-center gap-2"
        >
          <svg
            className="w-5 h-5"
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
          Nuevo Cliente
        </button>
      </div>

      {newClientCode && (
        <div className="mb-6 bg-gradient-to-r from-counsel-green/10 to-counsel-green-light/10 border-2 border-counsel-green/30 text-counsel-green px-6 py-4 rounded-xl flex justify-between items-center animate-fade-in shadow-lg">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-counsel-green rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="font-bold text-lg">Cliente creado exitosamente</p>
              <p className="text-sm mt-1">
                Código de acceso: <span className="font-mono font-bold bg-white px-3 py-1 rounded-lg border-2 border-counsel-green/30 text-counsel-green">{newClientCode}</span>
              </p>
            </div>
          </div>
          <button
            onClick={() => setNewClientCode(null)}
            className="text-counsel-green hover:text-counsel-green-light p-2 rounded-lg hover:bg-counsel-green/10 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

      {(showForm || editingClient) && (
        <div className="mb-6 card p-6 md:p-8 animate-fade-in">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-counsel-green to-counsel-green-light rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-counsel-green">
              {editingClient ? 'Editar Cliente' : 'Nuevo Cliente'}
            </h2>
          </div>
          <ClientForm
            client={editingClient}
            onSubmit={editingClient ? handleEdit : handleCreate}
            onCancel={() => {
              setShowForm(false);
              setEditingClient(null);
            }}
            loading={formLoading}
          />
        </div>
      )}

      {error && (
        <div className="mb-6 bg-red-50 text-red-600 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      <div className="card overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-counsel-green mx-auto"></div>
            <p className="mt-4 text-counsel-gray font-medium">Cargando clientes...</p>
          </div>
        ) : clients.length === 0 ? (
          <div className="p-12 text-center">
            <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <p className="text-counsel-gray font-medium">No hay clientes registrados</p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-xl border-2 border-gray-100">
            <table className="min-w-full divide-y divide-gray-100">
              <thead className="table-header">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                    Código
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                    Empresa
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                    Contacto
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-bold text-white uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {clients.map(client => (
                  <tr key={client.codigo} className="hover:bg-gradient-to-r hover:from-counsel-green/5 hover:to-counsel-green-light/5 transition-all duration-200 group">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="font-mono text-sm font-semibold bg-gradient-to-r from-counsel-green/10 to-counsel-green-light/10 px-3 py-1.5 rounded-lg border border-counsel-green/20 text-counsel-green">
                        {client.codigo}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap font-semibold text-counsel-gray-dark">
                      {client.empresa}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-counsel-gray font-medium">
                      {client.nombre}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleToggleActive(client)}
                        className={`px-3 py-1.5 text-xs font-semibold rounded-full transition-all duration-200 ${
                          client.activo
                            ? 'bg-counsel-green/10 text-counsel-green border border-counsel-green/20 hover:bg-counsel-green/20'
                            : 'bg-gray-100 text-counsel-gray border border-gray-200 hover:bg-gray-200'
                        }`}
                      >
                        {client.activo ? 'Activo' : 'Inactivo'}
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <button
                        onClick={() => setEditingClient(client)}
                        className="text-counsel-green hover:text-counsel-green-light font-semibold text-sm transition-colors px-3 py-1 rounded-lg hover:bg-counsel-green/10"
                      >
                        Editar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="mt-4 flex justify-end">
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
    </AdminLayout>
  );
}
