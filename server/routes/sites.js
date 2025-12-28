import express from 'express';
import jwt from 'jsonwebtoken';
import Site from '../models/Site.js';
import Domain from '../models/Domain.js';
import fetch from 'node-fetch';

const router = express.Router();

// JWT auth middleware
function auth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) return res.status(401).json({ msg: 'No token' });
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.id;
    next();
  } catch {
    res.status(401).json({ msg: 'Invalid token' });
  }
}

// Check (ping) a site's API endpoint and update status
router.post('/:id/check-status', auth, async (req, res) => {
  try {
    const site = await Site.findOne({ _id: req.params.id, user: req.user });
    if (!site) return res.status(404).json({ msg: 'Site not found' });
    let status = 'unknown';
    if (site.apiEndpoint) {
      try {
        const response = await fetch(site.apiEndpoint, { method: 'GET', timeout: 5000 });
        status = response.ok ? 'online' : 'offline';
      } catch {
        status = 'offline';
      }
    }
    site.lastChecked = new Date();
    site.lastStatus = status;
    await site.save();
    res.json({ lastChecked: site.lastChecked, lastStatus: site.lastStatus });
  } catch {
    res.status(500).json({ msg: 'Server error' });
  }
});
// Generate a new API key for a site
router.post('/:id/generate-key', auth, async (req, res) => {
  try {
    const site = await Site.findOne({ _id: req.params.id, user: req.user });
    if (!site) return res.status(404).json({ msg: 'Site not found' });
    site.generateApiKey();
    await site.save();
    res.json({ apiKey: site.apiKey });
  } catch {
    res.status(500).json({ msg: 'Server error' });
  }
});

// Rotate API key for a site
router.post('/:id/rotate-key', auth, async (req, res) => {
  try {
    const site = await Site.findOne({ _id: req.params.id, user: req.user });
    if (!site) return res.status(404).json({ msg: 'Site not found' });
    site.rotateApiKey();
    await site.save();
    res.json({ apiKey: site.apiKey, apiKeyHistory: site.apiKeyHistory });
  } catch {
    res.status(500).json({ msg: 'Server error' });
  }
});

// Revoke (delete) API key for a site
router.post('/:id/revoke-key', auth, async (req, res) => {
  try {
    const site = await Site.findOne({ _id: req.params.id, user: req.user });
    if (!site) return res.status(404).json({ msg: 'Site not found' });
    if (site.apiKey) {
      site.apiKeyHistory = site.apiKeyHistory || [];
      site.apiKeyHistory.push({ key: site.apiKey, rotatedAt: new Date() });
    }
    site.apiKey = undefined;
    await site.save();
    res.json({ msg: 'API key revoked' });
  } catch {
    res.status(500).json({ msg: 'Server error' });
  }
});
import express from 'express';
import jwt from 'jsonwebtoken';
import Site from '../models/Site.js';
import Domain from '../models/Domain.js';

const router = express.Router();

// JWT auth middleware
function auth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) return res.status(401).json({ msg: 'No token' });
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.id;
    next();
  } catch {
    res.status(401).json({ msg: 'Invalid token' });
  }
}

// Get all sites for a user
router.get('/', auth, async (req, res) => {
  try {
    const sites = await Site.find({ user: req.user }).populate('domain');
    res.json(sites);
  } catch {
    res.status(500).json({ msg: 'Server error' });
  }
});

// Add a new site (with API fields)
router.post('/', auth, async (req, res) => {
  const { name, domain, url, apiKey, apiEndpoint, status, description } = req.body;
  if (!name || !domain) return res.status(400).json({ msg: 'Site name and domain required' });
  try {
    const site = new Site({
      name,
      domain,
      url,
      apiKey,
      apiEndpoint,
      status,
      description,
      user: req.user
    });
    await site.save();
    res.status(201).json(site);
  } catch {
    res.status(500).json({ msg: 'Server error' });
  }
});

// Update a site by ID
router.put('/:id', auth, async (req, res) => {
  const { name, domain, url, apiKey, apiEndpoint, status, description } = req.body;
  try {
    const site = await Site.findOneAndUpdate(
      { _id: req.params.id, user: req.user },
      { name, domain, url, apiKey, apiEndpoint, status, description },
      { new: true }
    );
    if (!site) return res.status(404).json({ msg: 'Site not found' });
    res.json(site);
  } catch {
    res.status(500).json({ msg: 'Server error' });
  }
});

// Delete a site by ID
router.delete('/:id', auth, async (req, res) => {
  try {
    const site = await Site.findOneAndDelete({ _id: req.params.id, user: req.user });
    if (!site) return res.status(404).json({ msg: 'Site not found' });
    res.json({ msg: 'Site deleted' });
  } catch {
    res.status(500).json({ msg: 'Server error' });
  }
});

export default router;
