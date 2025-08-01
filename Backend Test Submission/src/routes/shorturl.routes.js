const express = require('express');
const { createShortUrl, getUrl, addClick, getStats } = require('../services/url.service');
const { Log } = require('../middleware/log');
const router = express.Router();

// Create Short URL
router.post('/shorturls', async (req, res) => {
  try {
    const { url, validity, shortcode } = req.body;
    if (!url) return res.status(400).json({ error: 'url is required' });
    const { code, expiry } = createShortUrl({ url, validity, shortcode });
    await Log('backend', 'info', 'shorturl.routes', `Short URL created: ${code}`);
    return res.status(201).json({ shortlink: `${req.protocol}://${req.get('host')}/${code}`, expiry: expiry.toISOString() });
  } catch (err) {
    await Log('backend', 'error', 'shorturl.routes', err.message);
    return res.status(400).json({ error: err.message });
  }
});

// Retrieve Short URL Stats
router.get('/shorturls/:code', async (req, res) => {
  const code = req.params.code;
  const stats = getStats(code);
  if (!stats) {
    await Log('backend', 'warn', 'shorturl.routes', `Stats not found for: ${code}`);
    return res.status(404).json({ error: 'Shortcode not found' });
  }
  await Log('backend', 'info', 'shorturl.routes', `Stats retrieved for: ${code}`);
  return res.json(stats);
});

// Redirect Short URL
router.get('/:code', async (req, res) => {
  const code = req.params.code;
  const data = getUrl(code);
  if (!data) {
    await Log('backend', 'warn', 'shorturl.routes', `Shortcode not found: ${code}`);
    return res.status(404).json({ error: 'Shortcode not found' });
  }
  if (new Date() > data.expiry) {
    await Log('backend', 'warn', 'shorturl.routes', `Shortcode expired: ${code}`);
    return res.status(410).json({ error: 'Shortcode expired' });
  }
  // Log click
  addClick(code, {
    timestamp: new Date(),
    referrer: req.get('referer') || null,
    ip: req.ip
  });
  await Log('backend', 'info', 'shorturl.routes', `Redirected: ${code}`);
  return res.redirect(data.url);
});

module.exports = router;
