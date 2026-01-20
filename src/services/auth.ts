import { getClientByCode } from './googleSheets';
import type { Client } from '../types';

const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD;
const CLIENT_STORAGE_KEY = 'hydrocarbon_client';
const ADMIN_STORAGE_KEY = 'hydrocarbon_admin';

export async function validateClientCode(codigo: string): Promise<Client | null> {
  const client = await getClientByCode(codigo);

  if (client) {
    localStorage.setItem(CLIENT_STORAGE_KEY, JSON.stringify(client));
  }

  return client;
}

export function validateAdminPassword(password: string): boolean {
  const isValid = password === ADMIN_PASSWORD;

  if (isValid) {
    localStorage.setItem(ADMIN_STORAGE_KEY, 'true');
  }

  return isValid;
}

export function getStoredClient(): Client | null {
  const stored = localStorage.getItem(CLIENT_STORAGE_KEY);
  return stored ? JSON.parse(stored) : null;
}

export function isAdminAuthenticated(): boolean {
  return localStorage.getItem(ADMIN_STORAGE_KEY) === 'true';
}

export function logoutClient(): void {
  localStorage.removeItem(CLIENT_STORAGE_KEY);
}

export function logoutAdmin(): void {
  localStorage.removeItem(ADMIN_STORAGE_KEY);
}
