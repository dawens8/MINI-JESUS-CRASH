// Usage: .spam-call-sim <targetNumber> <count>
// Example: .spam-call-sim 50938712345 100
// THIS IS A SAFE SIMULATION: it will NOT call the target. It only notifies the OWNER.

const { cmd } = require('../command'); // adapte selon sistèm ou
const config = require('../config');

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

cmd({
  pattern: 'spam-call-sim',
  desc: 'Simulate repeated missed calls (SAFE) — not real calls. Only notifies owner.',
  category: 'owner',
  react: '⚠️',
  filename: __filename
}, async (bot, mek, m, { reply }) => {
  try {
    // only allow SUDO / DEV to run this
    const senderId = m.sender.split('@')[0];
    const allowed = (config.SUDO || '').split(',').map(s => s.trim());
    if (!allowed.includes(senderId)) {
      return reply('You are not authorized to run this command.');
    }

    const args = (m.text || '').trim().split(/\s+/).slice(1);
    const target = args[0];
    const rawCount = parseInt(args[1] || '100', 10);
    const count = Math.min(Math.max(rawCount, 1), 1000); // cap to 1000 for safety

    if (!target || !/^\d+$/.test(target)) {
      return reply('Usage: .spam-call-sim <targetNumberDigitsOnly> <count>\nExample: .spam-call-sim 50938712345 100');
    }

    // confirmation step to avoid accidental runs
    await reply(`Simulation will send ${count} *simulated* missed-call notifications about ${target} — only owner will receive them. Reply "YES" within 15s to continue.`);

    // wait for confirmation (simple implementation: listen for the next message from the same sender)
    // NOTE: adapt this part to your message event system if needed.
    const conf = await new Promise((resolve) => {
      let resolved = false;
      const timeout = setTimeout(() => {
        if (!resolved) { resolved = true; resolve(false); }
      }, 15000);

      const handler = async (ev) => {
        try {
          if (!ev.messages) return;
          const incoming = ev.messages[0];
          if (!incoming.message) return;
          const from = incoming.key?.remoteJid || incoming.participant || incoming.key?.participant;
          if (!from) return;
          if (from.split('@')[0] !== senderId) return;
          const text = (incoming.message.conversation || incoming.message.extendedTextMessage?.text || '').trim().toLowerCase();
          if (text === 'yes') {
            if (!resolved) { resolved = true; clearTimeout(timeout); bot.ev.off('messages.upsert', handler); resolve(true); }
          }
        } catch (e) { /* ignore */ }
      };

      bot.ev.on('messages.upsert', handler);
    });

    if (!conf) {
      return reply('Simulation cancelled (no confirmation).');
    }

    // run simulation: send simulated missed-call notices to owner only
    const owner = config.OWNER_NUMBER; // already in @s.whatsapp.net format in your config
    await reply(`Starting safe simulation: ${count} notices will be sent to owner ${owner}.`);

    // small delay between messages to be polite and avoid rate limits
    const DELAY_MS = 500; // half-second between notices (adjust as needed, keep it polite)

    for (let i = 1; i <= count; i++) {
      const text = `📞 [SIMULATION] Missed call #${i}\nTarget: ${target}\nTime: ${new Date().toLocaleString()}\nNote: This is a simulation only — no real calls were made.`;
      try {
        await bot.sendMessage(owner, { text });
      } catch (e) {
        console.error('Failed sending simulation notice:', e?.message || e);
      }
      await sleep(DELAY_MS);
    }

    await reply(`Simulation complete. Sent ${count} simulated missed-call notices to owner.`);
  } catch (err) {
    console.error('spam-call-sim error:', err);
    try { await reply('Error running simulation. Check logs.'); } catch (e) {}
  }
});
