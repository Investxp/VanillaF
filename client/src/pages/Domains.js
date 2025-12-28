import React, { useEffect, useState } from 'react';
import { Typography, Box, Button, TextField, MenuItem, IconButton } from '@mui/material';
import DataTable from '../components/DataTable';
import ModalDialog from '../components/ModalDialog';
import NotificationBanner from '../components/NotificationBanner';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

const API_URL = process.env.REACT_APP_API_URL || 'https://server-production-aebe.up.railway.app';

export default function Domains() {
  const [domains, setDomains] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({ name: '' });
  const token = localStorage.getItem('token');

  const fetchDomains = async () => {
    setError('');
    try {
      const res = await fetch(`${API_URL}/api/domains`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      setDomains(data);
    } catch {
      setError('Could not fetch domains.');
    }
  };

  useEffect(() => { fetchDomains(); }, []);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleAdd = async () => {
    setError(''); setSuccess(''); setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/domains`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(form)
      });
      if (!res.ok) throw new Error('Failed to add domain');
      setSuccess('Domain added!');
      setForm({ name: '' });
      setOpen(false);
      fetchDomains();
    } catch { setError('Failed to add domain.'); }
    finally { setLoading(false); }
  };

  const handleDelete = async id => {
    setError(''); setSuccess(''); setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/domains/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Failed to delete domain');
      setSuccess('Domain deleted!');
      fetchDomains();
    } catch { setError('Failed to delete domain.'); }
    finally { setLoading(false); }
  };

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 2 }}>
      <Typography variant="h4" sx={{ mt: 4 }}>My Domains</Typography>
      <Button variant="contained" sx={{ mt: 2, mb: 2 }} onClick={() => { setOpen(true); setEditId(null); }}>Add Domain</Button>
      {error && <NotificationBanner severity="error" message={error} />}
      {success && <NotificationBanner severity="success" message={success} />}
      <DataTable
        columns={["name"]}
        rows={domains}
        actions={row => (
          <>
            <IconButton size="small" title="Edit" onClick={() => { setForm(row); setEditId(row._id); setOpen(true); }}><EditIcon /></IconButton>
            <IconButton size="small" title="Delete" onClick={() => handleDelete(row._id)}><DeleteIcon color="error" /></IconButton>
          </>
        )}
      />
      <ModalDialog
        open={open}
        title={editId ? 'Edit Domain' : 'Add New Domain'}
        onClose={() => setOpen(false)}
        onSubmit={handleAdd}
        submitLabel={editId ? 'Save' : 'Add Domain'}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          <TextField label="Domain Name" name="name" value={form.name} onChange={handleChange} required />
        </Box>
      </ModalDialog>
    </Box>
  );
}
