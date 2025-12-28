const API_URL = process.env.REACT_APP_API_URL || 'https://server-production-aebe.up.railway.app'; // Update here if server URL changes

export async function getDomains(token) {
  const res = await fetch(`${API_URL}/api/domains`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  if (!res.ok) throw new Error('Failed to fetch domains');
  return res.json();
}

export async function addDomain(domain, token) {
  const res = await fetch(`${API_URL}/api/domains`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ name: domain })
  });
  if (!res.ok) throw new Error('Failed to add domain');
  return res.json();
}
