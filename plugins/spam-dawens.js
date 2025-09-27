// plugins/spam-call.js
const { cmd } = require('../command');
const { placeCall } = require('../lib/twilioCaller');
const store = require('../lib/callConsentStore'); // konsantman
const config = require('../config');

const MAX_CALLS = 30; // limit apèl legal

cmd({
  pattern: 'spam-call',
  desc: 'Legally spam call (max 30 missed) only if consented',
  category: 'owner',
  react: '📞',
  filename: __filename
}, async (bot, m, { text, reply }) => {
  try {
    const number = text?.replace(/\D/g, ''); // digits only
    if (!number) return reply('Usage: .spam-call <digitsOnly e.g. 50938712345>');

    const consented = store.hasConsent(number);
    if (!consented) return reply(`❌ User +${number} has not given consent for calls.`);

    // Count how many calls already today
    const callsToday = store.getCallsToday(number);
    if (callsToday >= MAX_CALLS) return reply(`⚠️ Max ${MAX_CALLS} calls per 24h reached.`);

    reply(`📞 Sending up to ${MAX_CALLS - callsToday} legal calls to +${number}...`);

    for (let i = 0; i < MAX_CALLS - callsToday; i++) {
      await placeCall(`+${number}`, `This is a legal test call from ${config.BOT_NAME}.`);
      store.logCall(number);
    }

    reply(`✅ Done! Total calls today: ${store.getCallsToday(number)}`);
  } catch (err) {
    console.error(err);
    reply('❌ Error sending calls. Check Twilio credentials and bot config.');
  }
});
