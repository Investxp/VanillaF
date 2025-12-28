import React, { useState } from 'react';
import { Button, TextField, Typography, Container, Box, Alert, Link } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { login } from '../api';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await login(email, password);
      // Store token, redirect, etc.
      localStorage.setItem('token', res.token);
      window.location.href = '/dashboard';
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = () => {
    window.location.href = `${process.env.REACT_APP_API_URL || 'https://server-production-aebe.up.railway.app'}/api/auth/google`;
  };

  return (
    <Container maxWidth="xs">
      <Box sx={{ mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography component="h1" variant="h5">Login</Typography>
        {error && <Alert severity="error" sx={{ width: '100%', mt: 2 }}>{error}</Alert>}
        <form onSubmit={handleSubmit} style={{ width: '100%' }}>
          <TextField margin="normal" required fullWidth label="Email" autoFocus value={email} onChange={e => setEmail(e.target.value)} />
          <TextField margin="normal" required fullWidth label="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} />
          <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }} disabled={loading}>{loading ? 'Logging in...' : 'Login'}</Button>
        </form>
        <Button fullWidth variant="outlined" sx={{ mb: 2 }} onClick={handleGoogle}>Continue with Google</Button>
        <Button size="small">Forgot Password?</Button>
        <Link component={RouterLink} to="/register" variant="body2" sx={{ mt: 2 }}>
          Don't have an account? Sign Up
        </Link>
      </Box>
    </Container>
  );
};

export default Login;
