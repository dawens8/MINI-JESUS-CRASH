// commands/call-consent.js
const { cmd } = require('../command');
const store = require('../lib/callConsentStore');

cmd({
  pattern: 'call-consent',
  desc: 'Give consent to receive automated calls. Usage: .call-consent 509XXXXXXXX',
  category: 'main',
  filename: __filename
}, async (bot, mek, m, { reply }) => {
  try {
    const arg = (m.text || '').trim().split(/\s+/).slice(1).join('');
    if (!arg || !/^\d+$/.test(arg)) return reply('Usage: .call-consent <digitsOnly e.g. 50938712345>');

    const normalized = arg.startsWith('+') ? arg : (arg.startsWith('0') ? arg : `+${arg}`);
    // store consent (keep proof: who and message id)
    const consents = store.getConsents();
    consents[normalized] = {
      consent: true,
      when: new Date().toISOString(),
      fromJid: m.key.remoteJid || m.sender,
      proofMessageId: m.key.id || null
    };
    store.saveConsents(consents);

    await reply(`Consent recorded for ${normalized}. We will only call you if owner triggers and rate limits allow.`);
  } catch (e) {
    console.error(e);
    try { await reply('Error saving consent.'); } catch (err) {}
  }
});