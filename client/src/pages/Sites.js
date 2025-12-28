import React, { useEffect, useState } from 'react';
import {
  Typography, Container, Box, TextField, Button, Alert, MenuItem, Select, InputLabel, FormControl, IconButton
} from '@mui/material';
import DataTable from '../components/DataTable';
import ModalDialog from '../components/ModalDialog';
import NotificationBanner from '../components/NotificationBanner';
import KeyIcon from '@mui/icons-material/VpnKey';
import RefreshIcon from '@mui/icons-material/Refresh';
import DeleteIcon from '@mui/icons-material/Delete';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import SearchIcon from '@mui/icons-material/Search';

const API_URL = process.env.REACT_APP_API_URL || 'https://server-production-aebe.up.railway.app';

const Sites = () => {
  const [sites, setSites] = useState([]);
  const [domains, setDomains] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({
      // API Explorer state
      const [explorerOpen, setExplorerOpen] = useState(false);
      const [explorerSite, setExplorerSite] = useState(null);
      const [explorerMethod, setExplorerMethod] = useState('GET');
      const [explorerPath, setExplorerPath] = useState('');
      const [explorerBody, setExplorerBody] = useState('');
      const [explorerResponse, setExplorerResponse] = useState('');
      // API Explorer handler
      const handleOpenExplorer = (site) => {
        setExplorerSite(site);
        setExplorerMethod('GET');
        setExplorerPath('');
        return (
          <Box sx={{ maxWidth: 1200, mx: 'auto', p: 2 }}>
            <Typography variant="h4" sx={{ mt: 4 }}>My API Sites</Typography>
            <Button variant="contained" sx={{ mt: 2, mb: 2 }} onClick={() => { setOpen(true); setEditId(null); }}>Add Site</Button>
            {notifications.map((n, i) => (
              <NotificationBanner key={i} severity={n.type} message={n.message} />
            ))}
            {error && <NotificationBanner severity="error" message={error} />}
            {success && <NotificationBanner severity="success" message={success} />}
            <DataTable
              columns={["name", "domain", "url", "apiKey", "apiEndpoint", "status", "lastChecked", "lastStatus"]}
              rows={sites.map(site => ({
                ...site,
                domain: site.domain?.name || site.domain,
                lastChecked: site.lastChecked ? new Date(site.lastChecked).toLocaleString() : 'Never',
                lastStatus: site.lastStatus || 'unknown',
              }))}
              actions={row => (
                <>
                  <IconButton size="small" title="Generate Key" onClick={() => handleApiKeyAction(row._id, 'generate')}><KeyIcon /></IconButton>
                  <IconButton size="small" title="Rotate Key" onClick={() => handleApiKeyAction(row._id, 'rotate')}><RefreshIcon /></IconButton>
                  <IconButton size="small" title="Revoke Key" onClick={() => handleApiKeyAction(row._id, 'revoke')}><DeleteIcon /></IconButton>
                  <IconButton size="small" title="Check Status" onClick={() => handleCheckStatus(row._id)}><PlayArrowIcon /></IconButton>
                  <IconButton size="small" title="API Explorer" onClick={() => handleOpenExplorer(row)}><SearchIcon /></IconButton>
                  <IconButton size="small" title="Edit" onClick={() => { setForm(row); setEditId(row._id); setOpen(true); }}><RefreshIcon /></IconButton>
                  <IconButton size="small" title="Delete" onClick={() => handleDelete(row._id)}><DeleteIcon color="error" /></IconButton>
                </>
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
            {/* API Explorer Dialog (unchanged) */}
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
          </Box>
        );
      if (action === 'generate') url += '/generate-key';
      else if (action === 'rotate') url += '/rotate-key';
      else if (action === 'revoke') url += '/revoke-key';
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('API key action failed');
      setSuccess(`API key ${action}d!`);
      fetchSites();
    } catch {
      setError('API key action failed.');
    } finally {
      setLoading(false);
    }
  };

  // Check site status
  const handleCheckStatus = async (id) => {
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/sites/${id}/check-status`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Failed to check status');
      setSuccess('Site status checked!');
      fetchSites();
    } catch {
      setError('Failed to check site status.');
    } finally {
      setLoading(false);
    }
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
      {/* Persistent notifications for site/API issues */}
      {notifications.map((n, i) => (
        <Alert key={i} severity={n.type} sx={{ mt: 2 }}>{n.message}</Alert>
      ))}
      {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mt: 2 }}>{success}</Alert>}
      <List sx={{ mt: 4 }}>
        {sites.map(site => (
          <ListItem key={site._id} alignItems="flex-start" secondaryAction={
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Button size="small" onClick={() => handleApiKeyAction(site._id, 'generate')}>Generate Key</Button>
              <Button size="small" onClick={() => handleApiKeyAction(site._id, 'rotate')}>Rotate Key</Button>
              <Button size="small" onClick={() => handleApiKeyAction(site._id, 'revoke')}>Revoke Key</Button>
              <Button size="small" onClick={() => handleCheckStatus(site._id)}>Check Status</Button>
              <Button size="small" onClick={() => handleOpenExplorer(site)}>API Explorer</Button>
              <Button color="error" size="small" onClick={() => handleDelete(site._id)}>Delete</Button>
            </Box>
          }>
                  {/* API Explorer Dialog */}
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
            <ListItemText
              primary={site.name}
              secondary={
                <>
                  <div>Domain: {site.domain?.name || site.domain}</div>
                  <div>URL: {site.url}</div>
                  <div>API Key: {site.apiKey || <em>None</em>}</div>
                  <div>API Endpoint: {site.apiEndpoint}</div>
                  <div>Status: {site.status}</div>
                  <div>Description: {site.description}</div>
                  <div>Last Checked: {site.lastChecked ? new Date(site.lastChecked).toLocaleString() : 'Never'}</div>
                  <div>Last Status: {site.lastStatus || 'unknown'}</div>
                  {site.apiKeyHistory && site.apiKeyHistory.length > 0 && (
                    <div style={{ marginTop: 4 }}>
                      <b>API Key History:</b>
                      <ul style={{ margin: 0 }}>
                        {site.apiKeyHistory.map((h, i) => (
                          <li key={i}>{h.key} (rotated at {new Date(h.rotatedAt).toLocaleString()})</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </>
              }
            />
          </ListItem>
        ))}
      </List>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Add New Site</DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={handleAdd} sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
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
            <DialogActions>
              <Button onClick={() => setOpen(false)}>Cancel</Button>
              <Button type="submit" variant="contained" disabled={loading}>{loading ? 'Adding...' : 'Add Site'}</Button>
            </DialogActions>
          </Box>
        </DialogContent>
      </Dialog>
    </Container>
  );
};

export default Sites;
