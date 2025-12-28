import React, { useEffect, useState } from 'react';
import { Typography, Container, Box, TextField, Button, List, ListItem, ListItemText, Alert } from '@mui/material';
import { getDomains, addDomain } from '../apiDomains';
// Helper to parse token from URL
function getTokenFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get('token');
}

const Dashboard = () => {
  const [domains, setDomains] = useState([]);
  const [newDomain, setNewDomain] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchDomains = async () => {
    setError('');
    try {
      const token = localStorage.getItem('token');
      const data = await getDomains(token);
      setDomains(data);
    } catch (err) {
      setError('Could not fetch domains.');
    }
  };

  useEffect(() => {
    // If redirected from Google OAuth, store token
    const urlToken = getTokenFromUrl();
    if (urlToken) {
      localStorage.setItem('token', urlToken);
      window.history.replaceState({}, document.title, '/dashboard');
    }
    fetchDomains();
  }, []);

  const handleAddDomain = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      await addDomain(newDomain, token);
      setSuccess('Domain added!');
      setNewDomain('');
      fetchDomains();
    } catch (err) {
      setError('Failed to add domain.');
    } finally {
      setLoading(false);
    }
  };

  // Delete domain handler
  const handleDelete = async (id) => {
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${process.env.REACT_APP_API_URL || 'https://server-production-aebe.up.railway.app'}/api/domains/${id}`, { // Update here if server URL changes
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Failed to delete domain');
      setSuccess('Domain deleted!');
      fetchDomains();
    } catch {
      setError('Failed to delete domain.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md">
      <Typography variant="h4" sx={{ mt: 4 }}>Dashboard</Typography>
      <Typography sx={{ mt: 2 }}>Manage your domains and sites here.</Typography>
      {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mt: 2 }}>{success}</Alert>}
      <Box component="form" onSubmit={handleAddDomain} sx={{ mt: 4, display: 'flex', gap: 2 }}>
        <TextField label="New Domain" value={newDomain} onChange={e => setNewDomain(e.target.value)} required />
        <Button type="submit" variant="contained" disabled={loading}>{loading ? 'Adding...' : 'Add Domain'}</Button>
      </Box>
      <List sx={{ mt: 4 }}>
        {domains.map(domain => (
          <ListItem key={domain.id || domain._id} secondaryAction={
            <Button color="error" onClick={() => handleDelete(domain._id || domain.id)}>Delete</Button>
          }>
            <ListItemText primary={domain.name} />
          </ListItem>
        ))}
      </List>
    </Container>
  );
};

export default Dashboard;
