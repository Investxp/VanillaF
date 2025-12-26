import express from 'express';
import jwt from 'jsonwebtoken';
import Domain from '../models/Domain.js';
import User from '../models/User.js';

const router = express.Router();

// Delete a domain by ID
router.delete('/:id', auth, async (req, res) => {
  try {
    const domain = await Domain.findOneAndDelete({ _id: req.params.id, user: req.user });
    if (!domain) return res.status(404).json({ msg: 'Domain not found' });
    res.json({ msg: 'Domain deleted' });
  } catch {
    res.status(500).json({ msg: 'Server error' });
  }
});

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

// Get all domains for a user
router.get('/', auth, async (req, res) => {
  try {
    const domains = await Domain.find({ user: req.user });
    res.json(domains);
  } catch {
    res.status(500).json({ msg: 'Server error' });
  }
});

// Add a new domain
router.post('/', auth, async (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ msg: 'Domain name required' });
  try {
    const domain = new Domain({ name, user: req.user });
    await domain.save();
    res.status(201).json(domain);
  } catch {
    res.status(500).json({ msg: 'Server error' });
  }
});

export default router;
