import React from 'react';
import { Menu, MenuItem, Avatar, IconButton } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

export default function ProfileMenu({ anchorEl, open, onClose, onProfile, onLogout }) {
  return (
    <Menu anchorEl={anchorEl} open={open} onClose={onClose}>
      <MenuItem onClick={onProfile}><Avatar sx={{ mr: 1 }}><AccountCircleIcon /></Avatar>Profile</MenuItem>
      <MenuItem onClick={onLogout}>Logout</MenuItem>
    </Menu>
  );
}
