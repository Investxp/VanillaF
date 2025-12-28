import React, { useState } from 'react';
import { Button, TextField, Typography, Container, Box, Alert } from '@mui/material';
import { register } from '../api';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      await register(email, password, name);
      setSuccess('Registration successful! You can now log in.');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="xs">
      <Box sx={{ mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography component="h1" variant="h5">Sign Up</Typography>
        {error && <Alert severity="error" sx={{ width: '100%', mt: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ width: '100%', mt: 2 }}>{success}</Alert>}
        <form onSubmit={handleSubmit} style={{ width: '100%' }}>
          <TextField margin="normal" required fullWidth label="Name" value={name} onChange={e => setName(e.target.value)} />
          <TextField margin="normal" required fullWidth label="Email" value={email} onChange={e => setEmail(e.target.value)} />
          <TextField margin="normal" required fullWidth label="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} />
          <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }} disabled={loading}>{loading ? 'Signing up...' : 'Sign Up'}</Button>
        </form>
        <Button fullWidth variant="outlined" sx={{ mb: 2 }} onClick={() => window.location.href = "https://hub.deriv.com/tradershub/signup?t=113994&utm_campaign=myaffiliates"}>
          Sign up with Deriv
        </Button>
        <Button fullWidth variant="outlined" sx={{ mb: 2 }} color="primary" onClick={() => window.location.href = "https://hub.deriv.com/tradershub/signup?t=113994&utm_campaign=myaffiliates"}>
          Sign in with Deriv
        </Button>
      </Box>
    </Container>
  );
};

export default Register;
