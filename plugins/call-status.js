// commands/call-status.js
const { cmd } = require('../command');
const store = require('../lib/callConsentStore');

cmd({
  pattern: 'call-status',
  desc: 'Check consent status. Usage: .call-status 509XXXXXXXX',
  category: 'main',
  filename: __filename
}, async (bot, mek, m, { reply }) => {
  try {
    const arg = (m.text || '').trim().split(/\s+/).slice(1).join('');
    if (!arg || !/^\d+$/.test(arg)) return reply('Usage: .call-status <digitsOnly e.g. 50938712345>');
    const normalized = arg.startsWith('+') ? arg : `+${arg}`;
    const consents = store.getConsents();
    const info = consents[normalized];
    if (!info) return reply(`${normalized} has NOT given consent.`);
    await reply(`${normalized} consented at ${info.when}. Proof msg id: ${info.proofMessageId || 'n/a'}`);
  } catch (e) {
    console.error(e);
    try { await reply('Error reading status.'); } catch (err) {}
  }
});