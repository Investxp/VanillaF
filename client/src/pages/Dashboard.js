import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Typography, Container, Box, TextField, Button, List, ListItem, ListItemText, Alert, Drawer, ListItemIcon, Divider, Toolbar, AppBar, IconButton, Avatar, Grid, Paper } from '@mui/material';
import DashboardCard from '../components/DashboardCard';
import Logo from '../components/Logo';
import MenuIcon from '@mui/icons-material/Menu';
import DomainIcon from '@mui/icons-material/Language';
import SiteIcon from '@mui/icons-material/Web';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AddIcon from '@mui/icons-material/Add';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import { getDomains, addDomain } from '../apiDomains';
// Helper to parse token from URL
function getTokenFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get('token');
}

const drawerWidth = 220;

const mainMenu = [
  { text: 'Dashboard', icon: <DashboardIcon />, route: '/dashboard' },
  { text: 'My Domains', icon: <DomainIcon />, route: '/domains' },
  { text: 'My Sites', icon: <SiteIcon />, route: '/sites' },
];
const bottomMenu = [
  { text: 'Account/Profile', icon: <AccountCircleIcon />, route: '/profile' },
  { text: 'Logout', icon: <LogoutIcon />, route: '/logout' },
];

const Dashboard = () => {
  const navigate = useNavigate();
  const [domains, setDomains] = useState([]);
  const [sites, setSites] = useState([]);
  const [activity, setActivity] = useState([]);
  const [mobileOpen, setMobileOpen] = useState(false);
    const handleDrawerToggle = () => {
      setMobileOpen(!mobileOpen);
    };
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

  // Fetch sites for stats
  const fetchSites = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${process.env.REACT_APP_API_URL || 'https://server-production-aebe.up.railway.app'}/api/sites`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      setSites(data);
    } catch {}
  };

  // Simulate recent activity (replace with real API if available)
  useEffect(() => {
    setActivity([
      { type: 'domain', action: 'added', name: domains[0]?.name, date: new Date().toLocaleString() },
      { type: 'site', action: 'checked', name: sites[0]?.name, date: new Date().toLocaleString() },
    ]);
  }, [domains, sites]);

  useEffect(() => {
    // If redirected from Google OAuth, store token
    const urlToken = getTokenFromUrl();
    if (urlToken) {
      localStorage.setItem('token', urlToken);
      window.history.replaceState({}, document.title, '/dashboard');
    }
    fetchDomains();
    fetchSites();
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
    <Box sx={{ display: 'flex' }}>
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <IconButton color="inherit" edge="start" onClick={handleDrawerToggle} sx={{ mr: 2, display: { sm: 'none' } }}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            Dashboard
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: 'border-box',
            display: { xs: 'none', sm: 'flex' },
            flexDirection: 'column',
            justifyContent: 'space-between',
            bgcolor: '#f8f9fa',
            borderRight: '1px solid #e0e0e0',
          },
        }}
        open
      >
        <Box>
          <Toolbar sx={{ minHeight: 64 }}>
            <Logo />
          </Toolbar>
          <Divider />
          <List>
            {mainMenu.map((item, idx) => (
              <ListItem
                button
                key={item.text}
                selected={window.location.pathname === item.route}
                onClick={() => navigate(item.route)}
                sx={{
                  borderRadius: 2,
                  mx: 1,
                  my: 0.5,
                  bgcolor: window.location.pathname === item.route ? '#e3f2fd' : 'inherit',
                  color: window.location.pathname === item.route ? '#1976d2' : 'inherit',
                }}
              >
                <ListItemIcon sx={{ color: 'inherit' }}>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItem>
            ))}
          </List>
        </Box>
        <Box sx={{ mb: 2 }}>
          <Divider />
          <List>
            {bottomMenu.map((item, idx) => (
              <ListItem
                button
                key={item.text}
                onClick={() => navigate(item.route)}
                sx={{ borderRadius: 2, mx: 1, my: 0.5 }}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItem>
            ))}
            <ListItem sx={{ mt: 2, justifyContent: 'center' }}>
              <Avatar sx={{ width: 32, height: 32, bgcolor: '#1976d2' }}>
                <AccountCircleIcon />
              </Avatar>
            </ListItem>
          </List>
        </Box>
      </Drawer>
      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', sm: 'none' },
          [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: 'auto' }}>
          <List>
            {menuItems.map((item, idx) => (
              <ListItem
                button
                key={item.text}
                onClick={() => {
                  if (item.text === 'Dashboard') navigate('/dashboard');
                  else if (item.text === 'My Domains') navigate('/dashboard');
                  else if (item.text === 'My Sites') navigate('/sites');
                  // Add more navigation as needed
                }}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` } }}>
        <Toolbar />
        <Typography variant="h4" sx={{ mt: 2 }}>Dashboard</Typography>
        <Typography sx={{ mt: 2 }}>Welcome! Here’s an overview of your account.</Typography>
        {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mt: 2 }}>{success}</Alert>}
        {/* Stat cards */}
        <Grid container spacing={2} sx={{ mt: 2 }}>
          <Grid item><DashboardCard title="Total Domains" value={domains.length} icon={<DomainIcon color="primary" />} /></Grid>
          <Grid item><DashboardCard title="Total Sites" value={sites.length} icon={<SiteIcon color="primary" />} /></Grid>
          {/* Add more stat cards as needed */}
        </Grid>
        {/* Recent activity */}
        <Paper sx={{ mt: 4, p: 2 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>Recent Activity</Typography>
          {activity.length === 0 ? (
            <Typography color="text.secondary">No recent activity.</Typography>
          ) : (
            <List>
              {activity.map((a, i) => (
                <ListItem key={i}>
                  <ListItemText primary={`${a.type === 'domain' ? 'Domain' : 'Site'} ${a.action}: ${a.name || ''}`} secondary={a.date} />
                </ListItem>
              ))}
            </List>
          )}
        </Paper>
        {/* Add Domain form (optional, can move to modal) */}
        <Paper sx={{ mt: 4, p: 2 }}>
          <Typography variant="h6">Add New Domain</Typography>
          <Box component="form" onSubmit={handleAddDomain} sx={{ mt: 2, display: 'flex', gap: 2 }}>
            <TextField label="New Domain" value={newDomain} onChange={e => setNewDomain(e.target.value)} required />
            <Button type="submit" variant="contained" disabled={loading}>{loading ? 'Adding...' : 'Add Domain'}</Button>
          </Box>
        </Paper>
        {/* Domain list (optional, can move to table) */}
        <Paper sx={{ mt: 4, p: 2 }}>
          <Typography variant="h6">My Domains</Typography>
          <List>
            {domains.map(domain => (
              <ListItem key={domain.id || domain._id} secondaryAction={
                <Button color="error" onClick={() => handleDelete(domain._id || domain.id)}>Delete</Button>
              }>
                <ListItemText primary={domain.name} />
              </ListItem>
            ))}
          </List>
        </Paper>
      </Box>
    </Box>
  );
};

export default Dashboard;
