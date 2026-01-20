import type { Client, Product, Price } from '../types';

const SPREADSHEET_ID = import.meta.env.VITE_GOOGLE_SPREADSHEET_ID;
const SERVICE_ACCOUNT_EMAIL = import.meta.env.VITE_GOOGLE_SERVICE_ACCOUNT_EMAIL;
const PRIVATE_KEY = import.meta.env.VITE_GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n');
const SCOPES = 'https://www.googleapis.com/auth/spreadsheets';

let cachedToken: { token: string; expires: number } | null = null;

async function getAccessToken(): Promise<string> {
  if (cachedToken && Date.now() < cachedToken.expires) {
    return cachedToken.token;
  }

  const now = Math.floor(Date.now() / 1000);
  const exp = now + 3600;

  const header = { alg: 'RS256', typ: 'JWT' };
  const payload = {
    iss: SERVICE_ACCOUNT_EMAIL,
    scope: SCOPES,
    aud: 'https://oauth2.googleapis.com/token',
    iat: now,
    exp: exp,
  };

  const jwt = await createJWT(header, payload, PRIVATE_KEY);

  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: jwt,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to get access token: ${error}`);
  }

  const data = await response.json();
  cachedToken = {
    token: data.access_token,
    expires: Date.now() + (data.expires_in - 60) * 1000,
  };

  return cachedToken.token;
}

async function createJWT(
  header: object,
  payload: object,
  privateKey: string
): Promise<string> {
  const enc = new TextEncoder();

  const headerB64 = base64UrlEncode(JSON.stringify(header));
  const payloadB64 = base64UrlEncode(JSON.stringify(payload));
  const unsignedToken = `${headerB64}.${payloadB64}`;

  const pemContents = privateKey
    .replace(/-----BEGIN PRIVATE KEY-----/, '')
    .replace(/-----END PRIVATE KEY-----/, '')
    .replace(/\s/g, '');

  const binaryKey = Uint8Array.from(atob(pemContents), (c) => c.charCodeAt(0));

  const cryptoKey = await crypto.subtle.importKey(
    'pkcs8',
    binaryKey,
    { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
    false,
    ['sign']
  );

  const signature = await crypto.subtle.sign(
    'RSASSA-PKCS1-v1_5',
    cryptoKey,
    enc.encode(unsignedToken)
  );

  const signatureB64 = base64UrlEncode(
    String.fromCharCode(...new Uint8Array(signature))
  );

  return `${unsignedToken}.${signatureB64}`;
}

function base64UrlEncode(str: string): string {
  const base64 = btoa(str);
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

const BASE_URL = 'https://sheets.googleapis.com/v4/spreadsheets';

interface SheetResponse {
  values: string[][];
}

async function fetchSheet(sheetName: string): Promise<string[][]> {
  const token = await getAccessToken();
  const url = `${BASE_URL}/${SPREADSHEET_ID}/values/${encodeURIComponent(sheetName)}`;

  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    throw new Error(`Error fetching ${sheetName}: ${response.statusText}`);
  }

  const data: SheetResponse = await response.json();
  return data.values || [];
}

async function appendToSheet(sheetName: string, values: string[][]): Promise<void> {
  const token = await getAccessToken();
  const url = `${BASE_URL}/${SPREADSHEET_ID}/values/${encodeURIComponent(sheetName)}:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ values }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Error appending to ${sheetName}: ${error}`);
  }
}

async function updateSheet(sheetName: string, range: string, values: string[][]): Promise<void> {
  const token = await getAccessToken();
  const url = `${BASE_URL}/${SPREADSHEET_ID}/values/${encodeURIComponent(sheetName)}!${range}?valueInputOption=USER_ENTERED`;

  const response = await fetch(url, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ values }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Error updating ${sheetName}: ${error}`);
  }
}

export async function getClients(): Promise<Client[]> {
  const rows = await fetchSheet('Clientes');

  if (rows.length <= 1) return [];

  return rows.slice(1).map(row => ({
    codigo: row[0] || '',
    nombre: row[1] || '',
    empresa: row[2] || '',
    activo: row[3]?.toLowerCase() === 'true',
  }));
}

export async function getClientByCode(codigo: string): Promise<Client | null> {
  const clients = await getClients();
  return clients.find(c => c.codigo === codigo && c.activo) || null;
}

export async function getProducts(): Promise<Product[]> {
  const rows = await fetchSheet('Productos');

  if (rows.length <= 1) return [];

  return rows.slice(1).map(row => ({
    id: row[0] || '',
    nombre: row[1] || '',
    descripcion: row[2] || '',
  }));
}

export async function getPrices(): Promise<Price[]> {
  const rows = await fetchSheet('Precios');

  if (rows.length <= 1) return [];

  return rows.slice(1).map(row => ({
    fecha: row[0] || '',
    codigo_cliente: row[1] || '',
    producto_id: row[2] || '',
    precio: parseFloat(row[3]) || 0,
  }));
}

export async function getPricesByClient(codigoCliente: string, fecha?: string): Promise<Price[]> {
  const prices = await getPrices();

  return prices.filter(p => {
    const matchesClient = p.codigo_cliente === codigoCliente;
    const matchesDate = fecha ? p.fecha === fecha : true;
    return matchesClient && matchesDate;
  });
}

export async function getLatestPricesByClient(codigoCliente: string): Promise<Price[]> {
  const prices = await getPrices();
  const clientPrices = prices.filter(p => p.codigo_cliente === codigoCliente);

  if (clientPrices.length === 0) return [];

  const sortedDates = [...new Set(clientPrices.map(p => p.fecha))].sort().reverse();
  const latestDate = sortedDates[0];

  return clientPrices.filter(p => p.fecha === latestDate);
}

export async function addClient(client: Omit<Client, 'codigo'>): Promise<string> {
  const codigo = generateClientCode();
  await appendToSheet('Clientes', [[
    codigo,
    client.nombre,
    client.empresa,
    String(client.activo),
  ]]);
  return codigo;
}

export async function addProduct(product: Product): Promise<void> {
  await appendToSheet('Productos', [[
    product.id,
    product.nombre,
    product.descripcion,
  ]]);
}

export async function addPrice(price: Price): Promise<void> {
  await appendToSheet('Precios', [[
    price.fecha,
    price.codigo_cliente,
    price.producto_id,
    String(price.precio),
  ]]);
}

export async function addPrices(prices: Price[]): Promise<void> {
  const values = prices.map(p => [
    p.fecha,
    p.codigo_cliente,
    p.producto_id,
    String(p.precio),
  ]);
  await appendToSheet('Precios', values);
}

export async function updateClient(codigo: string, updates: Partial<Client>): Promise<void> {
  const clients = await getClients();
  const index = clients.findIndex(c => c.codigo === codigo);

  if (index === -1) {
    throw new Error(`Client with code ${codigo} not found`);
  }

  const updatedClient = { ...clients[index], ...updates };
  const rowIndex = index + 2;

  await updateSheet('Clientes', `A${rowIndex}:D${rowIndex}`, [[
    updatedClient.codigo,
    updatedClient.nombre,
    updatedClient.empresa,
    String(updatedClient.activo),
  ]]);
}

function generateClientCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

export function getTodayDate(): string {
  return new Date().toISOString().split('T')[0];
}
