import React, { useState } from 'react';
import { Box, Typography, Avatar, Button, TextField, Paper, Grid, Divider, IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import ColorLensIcon from '@mui/icons-material/ColorLens';

const userMock = {
  name: 'Jane Doe',
  email: 'jane.doe@email.com',
  avatar: 'https://i.pravatar.cc/150?img=5',
  role: 'Admin',
  bio: 'Building the future of trading APIs. Passionate about fintech, design, and automation.'
};

const accentColors = ['#1976d2', '#d32f2f', '#388e3c', '#fbc02d', '#7b1fa2'];

export default function ProfilePanel() {
  const [editMode, setEditMode] = useState(false);
  const [user, setUser] = useState(userMock);
  const [color, setColor] = useState(accentColors[0]);

  const handleChange = e => setUser({ ...user, [e.target.name]: e.target.value });

  return (
    <Box sx={{ maxWidth: 500, mx: 'auto', mt: 6 }}>
      <Paper elevation={4} sx={{ p: 4, borderRadius: 4, bgcolor: color + '22', position: 'relative' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
          <Avatar src={user.avatar} sx={{ width: 80, height: 80, border: `4px solid ${color}` }} />
          <Box>
            <Typography variant="h5" sx={{ color }}>{user.name}</Typography>
            <Typography variant="body2" color="text.secondary">{user.email}</Typography>
            <Typography variant="caption" sx={{ bgcolor: color, color: '#fff', px: 1.5, py: 0.5, borderRadius: 2, fontWeight: 500 }}>{user.role}</Typography>
          </Box>
          <IconButton onClick={() => setEditMode(!editMode)} sx={{ ml: 'auto' }} color="primary">
            {editMode ? <SaveIcon /> : <EditIcon />}
          </IconButton>
        </Box>
        <Divider sx={{ my: 3 }} />
        <Box>
          {editMode ? (
            <TextField name="bio" label="Bio" value={user.bio} onChange={handleChange} multiline rows={3} fullWidth sx={{ mb: 2 }} />
          ) : (
            <Typography variant="body1" sx={{ mb: 2 }}>{user.bio}</Typography>
          )}
        </Box>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>Accent Color:</Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              {accentColors.map(c => (
                <IconButton key={c} onClick={() => setColor(c)} sx={{ bgcolor: c + '44', border: c === color ? `2px solid ${c}` : 'none' }}>
                  <ColorLensIcon sx={{ color: c }} />
                </IconButton>
              ))}
            </Box>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Button variant="contained" color="primary" sx={{ mt: 2, bgcolor: color }} fullWidth>Update Profile</Button>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
}
