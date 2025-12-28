import fetch from 'node-fetch';
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
    res.status(500).json({ msg: 'Serv