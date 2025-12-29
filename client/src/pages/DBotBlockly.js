import React, { useEffect } from 'react';
import { Container, Typography, Box, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function DBotBlockly() {
  const navigate = useNavigate();
  useEffect(() => {
    // Require login: redirect if no token
    const token = localStorage.getItem('token');
    if (!token) navigate('/login');
  }, [navigate]);

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" sx={{ mb: 2 }}>Deriv DBot Blockly</Typography>
      <Alert severity="info" sx={{ mb: 2 }}>
        You must be logged in to use the Deriv DBot builder. Your session is private and secure.
      </Alert>
      <Box sx={{ width: '100%', height: 700, border: '1px solid #e0e0e0', borderRadius: 2, overflow: 'hidden' }}>
        {/* Embed Deriv DBot Blockly via iframe */}
        <iframe
          src="https://bot.deriv.com/"
          title="Deriv DBot Blockly"
          width="100%"
          height="700"
          style={{ border: 'none' }}
          allow="clipboard-write"
        />
      </Box>
    </Container>
  );
}
