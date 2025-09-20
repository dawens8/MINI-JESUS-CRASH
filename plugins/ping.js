const os = require("os");
const { performance } = require("perf_hooks");
const { cmd } = require('../command');

cmd({
    pattern: "ping",
    alias: ["speed", "pong", "status"],
    desc: "Check bot's response time, RAM usage and uptime.",
    category: "main",
    use: '.ping',
    filename: __filename
},
async (conn, mek, m, { from }) => {
    try {
        let start = performance.now();

        // premye repons rapid
        let msg = await conn.sendMessage(from, { text: "⏳ Checking speed..." }, { quoted: mek });

        let end = performance.now();
        let speed = (end - start).toFixed(2);

        // uptime bot
        let uptime = process.uptime();
        let hours = Math.floor(uptime / 3600);
        let minutes = Math.floor((uptime % 3600) / 60);
        let seconds = Math.floor(uptime % 60);

        // RAM usage
        let usedMem = (process.memoryUsage().rss / 1024 / 1024).toFixed(2);
        let totalMem = (os.totalmem() / 1024 / 1024 / 1024).toFixed(2);

        let txt = `
╭─❍「 *BOT STATUS* 」
│ 🏓 *Ping:* ${speed} ms
│ ⏱ *Uptime:* ${hours}h ${minutes}m ${seconds}s
│ 💾 *RAM:* ${usedMem}MB / ${totalMem}GB
╰─────────────❍
        `;

        // modify msg pou fè l bèl
        await conn.sendMessage(from, { text: txt }, { quoted: mek, edit: msg.key });

    } catch (e) {
        console.error(e);
        await conn.sendMessage(from, { text: "❌ Error while checking ping." }, { quoted: mek });
    }
});
