import express from 'express';
import jwt from 'jsonwebtoken';
import Domain from '../models/Domain.js';
import Site from '../models/Site.js';

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

// Dashboard: get stats and recent activity
router.get('/', auth, async (req, res) => {
  try {
    const domainCount = await Domain.countDocuments({ user: req.user });
    const siteCount = await Site.countDocuments({ user: req.user });
    const recentDomains = await Domain.find({ user: req.user }).sort({ createdAt: -1 }).limit(5);
    const recentSites = await Site.find({ user: req.user }).sort({ createdAt: -1 }).limit(5);
    res.json({
      domainCount,
      siteCount,
      recentDomains,
      recentSites
    });
  } catch {
    res.status(500).json({ msg: 'Server error' });
  }
});

export default router;
