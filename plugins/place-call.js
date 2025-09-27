// commands/place-call.js
const { cmd } = require('../command');
const store = require('../lib/callConsentStore');
const config = require('../config');
const { placeCall } = require('../lib/twilioCaller');

const MAX_CALLS_PER_DAY = parseInt(process.env.MAX_CALLS_PER_DAY || '50', 10);

function countCallsInLast24(logs, toNumber) {
  const since = Date.now() - (24 * 60 * 60 * 1000);
  return logs.filter(l => l.to === toNumber && new Date(l.when).getTime() >= since).length;
}

cmd({
  pattern: 'place-call',
  desc: 'Owner: place a single call to a consented number. Usage: .place-call 509XXXXXXXX Optional message text',
  category: 'owner',
  filename: __filename
}, async (bot, mek, m, { reply }) => {
  try {
    const senderId = m.sender.split('@')[0];
    const allowed = (config.SUDO || '').split(',').map(s => s.trim());
    if (!allowed.includes(senderId)) return reply('You are not authorized.');

    const parts = (m.text || '').trim().split(/\s+/).slice(1);
    const targetDigits = parts[0];
    if (!targetDigits || !/^\d+$/.test(targetDigits)) return reply('Usage: .place-call 509XXXXXXXX Optional message text');

    const to = targetDigits.startsWith('+') ? targetDigits : `+${targetDigits}`;
    const msg = parts.slice(1).join(' ') || 'This is an authorized call.';

    const consents = store.getConsents();
    const info = consents[to];
    if (!info || !info.consent) return reply(`${to} has NOT given consent. Aborting.`);

    // rate limit check
    const logs = store.getLogs();
    const callsLast24 = countCallsInLast24(logs, to);
    if (callsLast24 >= MAX_CALLS_PER_DAY) {
      return reply(`Rate limit reached for ${to}: ${callsLast24}/${MAX_CALLS_PER_DAY} calls in the last 24h.`);
    }

    await reply(`Placing call to ${to} (consented). Please wait...`);
    try {
      const call = await placeCall(to, msg);
      // log the call
      store.appendLog({
        when: new Date().toISOString(),
        to,
        by: m.sender,
        callSid: call.sid || null,
        status: call.status || 'queued'
      });
      await reply(`Call placed. Twilio SID: ${call.sid || 'n/a'}.`);
    } catch (err) {
      console.error('Twilio call error:', err);
      store.appendLog({
        when: new Date().toISOString(),
        to,
        by: m.sender,
        callSid: null,
        status: 'error',
        error: String(err.message || err)
      });
      await reply('Failed to place call. Check server logs and Twilio configuration.');
    }
  } catch (e) {
    console.error('place-call handler error', e);
    try { await reply('Error handling place-call.'); } catch (er) {}
  }
});
