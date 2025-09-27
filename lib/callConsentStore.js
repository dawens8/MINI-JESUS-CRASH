// lib/callConsentStore.js
const fs = require('fs');
const path = require('path');

const CONSENT_FILE = path.join(__dirname, '..', 'data', 'consents.json');
const LOG_FILE = path.join(__dirname, '..', 'data', 'calls_log.json');

function readJson(p, fallback) {
  try {
    if (!fs.existsSync(p)) return fallback;
    return JSON.parse(fs.readFileSync(p, 'utf8') || '{}');
  } catch (e) {
    console.error('readJson error', e);
    return fallback;
  }
}

function writeJson(p, data) {
  fs.writeFileSync(p, JSON.stringify(data, null, 2), 'utf8');
}

module.exports = {
  getConsents() { return readJson(CONSENT_FILE, {}); },
  saveConsents(obj) { writeJson(CONSENT_FILE, obj); },

  getLogs() { return readJson(LOG_FILE, []); },
  appendLog(entry) {
    const logs = readJson(LOG_FILE, []);
    logs.push(entry);
    writeJson(LOG_FILE, logs);
  }
};