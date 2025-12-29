import React from 'react';
import { AppBar, Toolbar, Typography, Box, IconButton } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircle from '@mui/icons-material/AccountCircle';

const Topbar = () => (
  <AppBar position="static" elevation={0} sx={{ background: '#fff', color: '#212B36', borderBottom: '1px solid #e0e0e0' }}>
    <Toolbar>
      <IconButton edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }}>
        <MenuIcon />
      </IconButton>
      <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 700 }}>
        DerivSites Dashboard
      </Typography>
      <Box>
        <IconButton color="inherit">
          <AccountCircle />
        </IconButton>
      </Box>
    </Toolbar>
  </AppBar>
);

export default Topbar;
