const { cmd } = require('../command');

cmd({
    pattern: "uptime",
    alias: ["runtime", "alive"],
    desc: "Check bot uptime",
    category: "utility",
    react: "⏱️",
    filename: __filename
},
async (conn, mek, m, { from, reply }) => {
    try {
        // ⏱️ Function pou formate uptime
        const formatUptime = (seconds) => {
            const days = Math.floor(seconds / (3600 * 24));
            const hours = Math.floor((seconds % (3600 * 24)) / 3600);
            const minutes = Math.floor((seconds % 3600) / 60);
            const secs = Math.floor(seconds % 60);
            
            let timeString = '';
            if (days > 0) timeString += `📅 ${days}d `;
            if (hours > 0) timeString += `⏰ ${hours}h `;
            if (minutes > 0) timeString += `🕒 ${minutes}m `;
            timeString += `⏱️ ${secs}s`;
            
            return timeString.trim();
        };

        const uptime = formatUptime(process.uptime());

        // ✨ Bèl estil mesaj la
        const message = `╭───〔 *BOT STATUS* 〕───⬣
│ 🤖 *Uptime:* ${uptime}
│ ⚡ *Status:* Online ✅
│ 📡 *Ping:* ${Date.now() - m.messageTimestamp * 1000}ms
╰──────────────⬣`;

        await conn.sendMessage(from, { 
            text: message,
            contextInfo: {
                isForwarded: true,
                forwardingScore: 777
            }
        }, { quoted: mek });

    } catch (e) {
        console.error("❌ Error in uptime command:", e);
        reply(`❌ Error checking uptime: ${e.message}`);
    }
});