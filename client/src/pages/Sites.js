import React, { useState } from 'react';
import {
  Typography, Container, Box, TextField, Button, Alert, MenuItem, Select, InputLabel, FormControl, IconButton, Dialog, DialogTitle, DialogContent, DialogActions
} from '@mui/material';
import DataTable from '../components/DataTable';
import ModalDialog from '../components/ModalDialog';
import KeyIcon from '@mui/icons-material/VpnKey';
import RefreshIcon from '@mui/icons-material/Refresh';
import DeleteIcon from '@mui/icons-material/Delete';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import SearchIcon from '@mui/icons-material/Search';

const Sites = () => {
  const [sites, setSites] = useState([]);
  const [domains, setDomains] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({
    name: '',
    domain: '',
    url: '',
    apiKey: '',
    apiEndpoint: '',
    status: '',
    description: ''
  });
  // API Explorer state
  const [explorerOpen, setExplorerOpen] = useState(false);
  const [explorerSite, setExplorerSite] = useState(null);
  const [explorerMethod, setExplorerMethod] = useState('GET');
  const [explorerPath, setExplorerPath] = useState('');
  const [explorerBody, setExplorerBody] = useState('');
  const [explorerResponse, setExplorerResponse] = useState('');

  // Dummy handlers for demonstration
  const handleApiKeyAction = () => {};
  const handleCheckStatus = () => {};
  const handleDelete = () => {};
  const handleAdd = () => {};
  const handleSendExplorer = () => {};
  const handleChange = () => {};

  const handleOpenExplorer = (site) => {
    setExplorerSite(site);
    setExplorerMethod('GET');
    setExplorerPath('');
    setExplorerBody('');
    setExplorerResponse('');
    setExplorerOpen(true);
  };

  // Collect notifications for offline sites or API key errors
  const notifications = [];
  sites.forEach(site => {
    if (site.lastStatus === 'offline') {
      notifications.push({
        type: 'error',
        message: `Site "${site.name}" is offline (last checked: ${site.lastChecked ? new Date(site.lastChecked).toLocaleString() : 'never'}).`
      });
    }
    if (!site.apiKey) {
      notifications.push({
        type: 'warning',
        message: `Site "${site.name}" has no API key set.`
      });
    }
  });

  return (
    <Container maxWidth="md">
      <Typography variant="h4" sx={{ mt: 4 }}>My API Sites</Typography>
      <Button variant="contained" sx={{ mt: 2 }} onClick={() => setOpen(true)}>Add Site</Button>
      {notifications.map((n, i) => (
        <Alert key={i} severity={n.type} sx={{ mt: 2 }}>{n.message}</Alert>
      ))}
      {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mt: 2 }}>{success}</Alert>}
      <DataTable
        columns={["name", "domain", "url", "apiKey", "apiEndpoint", "status", "lastChecked", "lastStatus"]}
        rows={sites.map(site => ({
          ...site,
          domain: site.domain?.name || site.domain,
          lastChecked: site.lastChecked ? new Date(site.lastChecked).toLocaleString() : 'Never',
          lastStatus: site.lastStatus || 'unknown',
        }))}
        actions={row => (
          <div style={{ display: 'flex', gap: 4 }}>
            <IconButton size="small" title="Generate Key" onClick={() => handleApiKeyAction(row._id, 'generate')}><KeyIcon /></IconButton>
            <IconButton size="small" title="Rotate Key" onClick={() => handleApiKeyAction(row._id, 'rotate')}><RefreshIcon /></IconButton>
            <IconButton size="small" title="Revoke Key" onClick={() => handleApiKeyAction(row._id, 'revoke')}><DeleteIcon /></IconButton>
            <IconButton size="small" title="Check Status" onClick={() => handleCheckStatus(row._id)}><PlayArrowIcon /></IconButton>
            <IconButton size="small" title="API Explorer" onClick={() => handleOpenExplorer(row)}><SearchIcon /></IconButton>
            <IconButton size="small" title="Edit" onClick={() => { setForm(row); setEditId(row._id); setOpen(true); }}><RefreshIcon /></IconButton>
            <IconButton size="small" title="Delete" onClick={() => handleDelete(row._id)}><DeleteIcon color="error" /></IconButton>
          </div>
        )}
      />
      <ModalDialog
        open={open}
        title={editId ? 'Edit Site' : 'Add New Site'}
        onClose={() => setOpen(false)}
        onSubmit={editId ? () => {/* handleEdit */} : handleAdd}
        submitLabel={editId ? 'Save' : 'Add Site'}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          <TextField label="Site Name" name="name" value={form.name} onChange={handleChange} required />
          <FormControl required>
            <InputLabel>Domain</InputLabel>
            <Select name="domain" value={form.domain} onChange={handleChange} label="Domain">
              {domains.map(domain => (
                <MenuItem key={domain._id} value={domain._id}>{domain.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField label="Site URL" name="url" value={form.url} onChange={handleChange} />
          <TextField label="API Key" name="apiKey" value={form.apiKey} onChange={handleChange} />
          <TextField label="API Endpoint" name="apiEndpoint" value={form.apiEndpoint} onChange={handleChange} />
          <FormControl>
            <InputLabel>Status</InputLabel>
            <Select name="status" value={form.status} onChange={handleChange} label="Status">
              <MenuItem value="active">Active</MenuItem>
              <MenuItem value="inactive">Inactive</MenuItem>
            </Select>
          </FormControl>
          <TextField label="Description" name="description" value={form.description} onChange={handleChange} multiline rows={2} />
        </Box>
      </ModalDialog>
      <Dialog open={explorerOpen} onClose={() => setExplorerOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>API Explorer - {explorerSite?.name}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
            <FormControl sx={{ minWidth: 100 }}>
              <InputLabel>Method</InputLabel>
              <Select value={explorerMethod} label="Method" onChange={e => setExplorerMethod(e.target.value)}>
                <MenuItem value="GET">GET</MenuItem>
                <MenuItem value="POST">POST</MenuItem>
              </Select>
            </FormControl>
            <TextField label="Path (e.g. /ping)" value={explorerPath} onChange={e => setExplorerPath(e.target.value)} sx={{ flex: 1 }} />
          </Box>
          {explorerMethod === 'POST' && (
            <TextField
              label="Request Body (JSON)"
              value={explorerBody}
              onChange={e => setExplorerBody(e.target.value)}
              multiline
              minRows={2}
              fullWidth
              sx={{ mb: 2 }}
            />
          )}
          <Button variant="contained" onClick={handleSendExplorer} sx={{ mb: 2 }}>Send</Button>
          <Typography variant="subtitle2">Response:</Typography>
          <Box sx={{ bgcolor: '#f5f5f5', p: 2, borderRadius: 1, minHeight: 80, fontFamily: 'monospace', whiteSpace: 'pre-wrap' }}>
            {explorerResponse}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setExplorerOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Sites;
