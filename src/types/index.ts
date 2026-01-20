export interface Client {
  codigo: string;
  nombre: string;
  empresa: string;
  activo: boolean;
}

export interface Product {
  id: string;
  nombre: string;
  descripcion: string;
}

export interface Price {
  fecha: string;
  codigo_cliente: string;
  producto_id: string;
  precio: number;
}

export interface ClientPrice extends Price {
  producto_nombre?: string;
  producto_descripcion?: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  client: Client | null;
  isAdmin: boolean;
}
