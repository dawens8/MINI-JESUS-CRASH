const config = require('../config');
const { cmd, commands } = require('../command');

cmd({
    pattern: "ping",
    alias: ["speed","pong"],use: '.ping',
    desc: "Check bot's response time.",
    category: "main",
    react: "⚡",
    filename: __filename
},
async (conn, mek, m, { from, quoted, sender, reply }) => {
    try {
        const start = new Date().getTime();

        const reactionEmojis = ['🔥', '⚡', '🚀', '💨', '🎯', '🎉', '🌟', '💥', '🕐', '🔹'];
        const textEmojis = ['💎', '🏆', '⚡️', '🚀', '🎶', '🌠', '🌀', '🔱', '🛡️', '✨'];

        const reactionEmoji = reactionEmojis[Math.floor(Math.random() * reactionEmojis.length)];
        let textEmoji = textEmojis[Math.floor(Math.random() * textEmojis.length)];

        // Ensure reaction and text emojis are different
        while (textEmoji === reactionEmoji) {
            textEmoji = textEmojis[Math.floor(Math.random() * textEmojis.length)];
        }

        // Send reaction using conn.sendMessage()
        await conn.sendMessage(from, {
            react: { text: textEmoji, key: mek.key }
        });

        const end = new Date().getTime();
        const responseTime = (end - start) / 1000;

        const text = `> *MINI-JESUS-CRASH 𝛅Ꭾ𝐄𝐄𝐃: ${responseTime.toFixed(2)}ms ${reactionEmoji}*`;

        await conn.sendMessage(from, {
            text,
            contextInfo: {
                mentionedJid: [sender],
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363419768812867@newsletter',
                    newsletterName: "MINI-JESUS-CRASH",
                    serverMessageId: 143
                }
            }
        }, { quoted: mek });

    } catch (e) {
        console.error("Error in ping command:", e);
        reply(`An error occurred: ${e.message}`);
    }
});

// ping2 

cmd({
    pattern: "ping2",
    desc: "Check bot's response time.",
    category: "main",
    react: "⚡",
    filename: __filename
},
async (conn, mek, m, { from, reply }) => {
    try {
        const start = Date.now();
        const tempMsg = await conn.sendMessage(from, { text: "🍂 *Pinging...*" }, { quoted: mek });
        const ping = Date.now() - start;

        const text = `╭───〔 ⚡ *PING RESULT* ⚡ 〕───⬣
│ 🚀 *Bot:* MINI-JESUS-CRASH
│ 🛰️ *Speed:* ${ping}ms
│ ✅ *Status:* Active
╰────────────────────⬣`;

        await conn.sendMessage(from, { text }, { quoted: tempMsg });

    } catch (e) {
        console.error("❌ Ping2 error:", e);
        reply(`❌ Error: ${e.message}`);
    }
});