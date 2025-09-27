// .spam-call-sim safe simulation (no real calls)
// Usage: .spam-call-sim 50938712345
const { cmd } = require('../command'); // adapte selon sistèm w
const config = require('../config');

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

cmd({
  pattern: 'spam-call-2',
  desc: 'SAFE: simulate 30 missed calls (no real calls). Owner receives notifications.',
  category: 'owner',
  react: '⚠️',
  filename: __filename
}, async (bot, mek, m, { reply }) => {
  try {
    const senderId = m.sender.split('@')[0];
    const allowed = (config.SUDO || '').split(',').map(s => s.trim());
    if (!allowed.includes(senderId)) return reply('You are not authorized to run this command.');

    const args = (m.text || '').trim().split(/\s+/).slice(1);
    const target = args[0];
    if (!target || !/^\d+$/.test(target)) {
      return reply('Usage: .spam-call-sim <targetNumberDigitsOnly>\nExample: .spam-call-sim 50938712345');
    }

    const COUNT = 30;           // number of simulated missed calls
    const DELAY_MS = 700;       // delay between notifications (be polite)

    await reply(`Simulation will send ${COUNT} simulated missed-call notices for ${target} — ONLY the owner will receive them. Reply "YES" within 15s to confirm.`);

    // simple confirmation wait (adapt if your bot framework differs)
    const confirmed = await new Promise((resolve) => {
      let done = false;
      const to = setTimeout(() => { if (!done) { done = true; resolve(false); } }, 15000);

      const handler = (ev) => {
        try {
          if (!ev.messages) return;
          const inc = ev.messages[0];
          if (!inc.message) return;
          const from = inc.key?.remoteJid || inc.participant || inc.key?.participant;
          if (!from) return;
          if (from.split('@')[0] !== senderId) return;
          const text = (inc.message.conversation || inc.message.extendedTextMessage?.text || '').trim().toLowerCase();
          if (text === 'yes') {
            if (!done) { done = true; clearTimeout(to); bot.ev.off('messages.upsert', handler); resolve(true); }
          }
        } catch (e) {}
      };

      bot.ev.on('messages.upsert', handler);
    });

    if (!confirmed) {
      return reply('Simulation cancelled (no confirmation).');
    }

    await reply(`Starting safe simulation: sending ${COUNT} notices to owner (${config.OWNER_NUMBER})...`);

    for (let i = 1; i <= COUNT; i++) {
      const text = `📞 [SIMULATION] Missed call #${i}\nTarget: ${target}\nTime: ${new Date().toLocaleString()}\nNote: This is a simulation only — NO real calls were made.`;
      try {
        await bot.sendMessage(config.OWNER_NUMBER, { text });
      } catch (e) {
        console.error('Failed sending simulation notice:', e?.message || e);
      }
      await sleep(DELAY_MS);
    }

    await reply(`Simulation complete. Sent ${COUNT} simulated missed-call notices to owner.`);
  } catch (err) {
    console.error('spam-call-sim error:', err);
    try { await reply('Error running simulation. Check logs.'); } catch (e) {}
  }
});
