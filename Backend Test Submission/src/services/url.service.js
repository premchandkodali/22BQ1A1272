const crypto = require('crypto');

// In-memory store for URLs and stats
const urlStore = {};
const clickStats = {};

function generateShortcode(length = 6) {
  return crypto.randomBytes(length).toString('base64url').slice(0, length);
}

function isValidShortcode(code) {
  return /^[a-zA-Z0-9]{4,16}$/.test(code);
}

function createShortUrl({ url, validity = 30, shortcode }) {
  if (!url || typeof url !== 'string') throw new Error('Invalid URL');
  let code = shortcode;
  if (code) {
    if (!isValidShortcode(code)) throw new Error('Invalid shortcode');
    if (urlStore[code]) throw new Error('Shortcode already exists');
  } else {
    do {
      code = generateShortcode();
    } while (urlStore[code]);
  }
  const now = new Date();
  const expiry = new Date(now.getTime() + validity * 60000);
  urlStore[code] = {
    url,
    createdAt: now,
    expiry,
    clicks: 0
  };
  clickStats[code] = [];
  return { code, expiry };
}

function getUrl(code) {
  return urlStore[code];
}

function addClick(code, clickData) {
  if (clickStats[code]) {
    clickStats[code].push(clickData);
    urlStore[code].clicks++;
  }
}

function getStats(code) {
  const data = urlStore[code];
  if (!data) return null;
  return {
    url: data.url,
    createdAt: data.createdAt,
    expiry: data.expiry,
    clicks: data.clicks,
    clickDetails: clickStats[code] || []
  };
}

module.exports = { createShortUrl, getUrl, addClick, getStats };
