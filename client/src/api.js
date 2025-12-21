const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export async function login(email, password) {
  const res = await fetch(`${API_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  if (!res.ok) throw new Error((await res.json()).msg || 'Login failed');
  return res.json();
}

export async function register(email, password, name) {
  const res = await fetch(`${API_URL}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, name })
  });
  if (!res.ok) throw new Error((await res.json()).msg || 'Register failed');
  return res.json();
}
