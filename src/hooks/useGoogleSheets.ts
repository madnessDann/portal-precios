import { useState, useEffect, useCallback } from 'react';
import type { Client, Product, Price, ClientPrice } from '../types';
import {
  getClients,
  getProducts,
  getPrices,
  getLatestPricesByClient,
  addClient,
  addPrices,
  addProduct,
  updateClient,
} from '../services/googleSheets';

export function useClients() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchClients = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getClients();
      setClients(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error fetching clients');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchClients();
  }, [fetchClients]);

  const createClient = async (client: Omit<Client, 'codigo'>) => {
    const codigo = await addClient(client);
    await fetchClients();
    return codigo;
  };

  const editClient = async (codigo: string, updates: Partial<Client>) => {
    await updateClient(codigo, updates);
    await fetchClients();
  };

  return { clients, loading, error, refetch: fetchClients, createClient, editClient };
}

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getProducts();
      setProducts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error fetching products');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const createProduct = async (product: Product) => {
    await addProduct(product);
    await fetchProducts();
  };

  return { products, loading, error, refetch: fetchProducts, createProduct };
}

export function usePrices() {
  const [prices, setPrices] = useState<Price[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPrices = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getPrices();
      setPrices(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error fetching prices');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPrices();
  }, [fetchPrices]);

  const createPrices = async (newPrices: Price[]) => {
    await addPrices(newPrices);
    await fetchPrices();
  };

  return { prices, loading, error, refetch: fetchPrices, createPrices };
}

export function useClientPrices(codigoCliente: string) {
  const [prices, setPrices] = useState<ClientPrice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<string | null>(null);

  const fetchClientPrices = useCallback(async () => {
    if (!codigoCliente) {
      setPrices([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const [clientPrices, products] = await Promise.all([
        getLatestPricesByClient(codigoCliente),
        getProducts(),
      ]);

      const enrichedPrices: ClientPrice[] = clientPrices.map(price => {
        const product = products.find(p => p.id === price.producto_id);
        return {
          ...price,
          producto_nombre: product?.nombre,
          producto_descripcion: product?.descripcion,
        };
      });

      setPrices(enrichedPrices);

      if (enrichedPrices.length > 0) {
        setLastUpdate(enrichedPrices[0].fecha);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error fetching client prices');
    } finally {
      setLoading(false);
    }
  }, [codigoCliente]);

  useEffect(() => {
    fetchClientPrices();
  }, [fetchClientPrices]);

  return { prices, loading, error, lastUpdate, refetch: fetchClientPrices };
}
