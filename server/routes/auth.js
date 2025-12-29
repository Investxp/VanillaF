
import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import passport from 'passport';
import User from '../models/User.js';
import fetch from 'node-fetch';

const router = express.Router();

// Deriv OAuth callback
router.get('/deriv/callback', async (req, res) => {
  const { code } = req.query;
  if (!code) return res.status(400).json({ msg: 'Missing code from Deriv OAuth' });
  try {
    // Exchange code for access token
    const app_id = '118685';
    const affiliate_token = 'PkUUceJjYJuFfUyb_9NCN2Nd7ZgqdRLk';
    const tokenRes = await fetch(`https://oauth.deriv.com/oauth2/token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        client_id: app_id,
        affiliate_token
      })
    });
    const tokenData = await tokenRes.json();
    if (!tokenData.access_token) return res.status(400).json({ msg: 'Failed to get access token from Deriv' });

    // Fetch user info from Deriv API
    const userRes = await fetch('https://api.deriv.com/api/account/info', {
      headers: { Authorization: `Bearer ${tokenData.access_token}` }
    });
    const userData = await userRes.json();
    if (!userData.email) return res.status(400).json({ msg: 'Failed to get user info from Deriv' });

    // Find or create user in local DB
    let user = await User.findOne({ email: userData.email });
    if (!user) {
      user = new User({ email: userData.email, name: userData.full_name || userData.email });
      await user.save();
    }

    // Issue JWT
    const jwtToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    // Redirect to frontend with token
    res.redirect(`${process.env.CLIENT_URL || 'https://client-production-8540.up.railway.app'}/dashboard?token=${jwtToken}`);
  } catch (err) {
    console.error('Deriv OAuth error:', err);
    res.status(500).json({ msg: 'Deriv OAuth failed' });
  }
});

// Register
router.post('/register', async (req, res) => {
  const { email, password, name } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ msg: 'User already exists' });
    const hashed = await bcrypt.hash(password, 10);
    user = new User({ email, password: hashed, name });
    await user.save();
    res.status(201).json({ msg: 'User registered' });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: 'Invalid credentials' });
    if (!user.password) return res.status(400).json({ msg: 'Use Google login' });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.json({ token, user: { id: user._id, email: user.email, name: user.name } });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// Google OAuth (placeholder)
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Google OAuth callback: issue JWT and redirect to frontend with token
router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/' }), (req, res) => {
  const user = req.user;
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
  // Redirect to frontend with token in query param
  res.redirect(`${process.env.CLIENT_URL || 'https://client-production-8540.up.railway.app'}/dashboard?token=${token}`); // Update here if client URL changes
});

export default router;
