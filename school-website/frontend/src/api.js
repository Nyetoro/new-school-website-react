/**
 * Tiny fetch wrapper. Automatically attaches the JWT and unwraps JSON errors.
 */
const BASE = import.meta.env.VITE_API_URL || '/api';

async function request(path, { method = 'GET', body, auth = false } = {}) {
  const headers = { 'Content-Type': 'application/json' };
  if (auth) {
    const token = localStorage.getItem('token');
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const text = await res.text();
  const data = text ? JSON.parse(text) : null;

  if (!res.ok) throw new Error(data?.error || `Request failed (${res.status})`);
  return data;
}

export const api = {
  get:    (p, auth = false)        => request(p, { auth }),
  post:   (p, body, auth = false)  => request(p, { method: 'POST', body, auth }),
  put:    (p, body, auth = true)   => request(p, { method: 'PUT', body, auth }),
  patch:  (p, body, auth = true)   => request(p, { method: 'PATCH', body, auth }),
  delete: (p, auth = true)         => request(p, { method: 'DELETE', auth }),
};
