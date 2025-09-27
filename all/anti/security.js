// ⚡ SECURITY SYSTEM by DAWENS-BOY96
// Antibug | Antispam | Ghost Mode | Admin Shield

const config = require('../../config');

// 🛡 Rate Limit (Anti-Spam)
const rateLimit = {};
const LIMIT = 5;      // max 5 commands
const WINDOW = 10000; // nan 10 segonn

function isFlooding(sender) {
    const now = Date.now();
    if (!rateLimit[sender]) rateLimit[sender] = [];
    rateLimit[sender] = rateLimit[sender].filter(ts => now - ts < WINDOW);
    rateLimit[sender].push(now);
    return rateLimit[sender].length > LIMIT;
}

// 🛑 Anti-Bug Message
function isBugMessage(message) {
    if (!message) return false;
    if (message.length > 4000) return true; // msg twò long
    if (/[\u200B-\u200F]/.test(message)) return true; // zero-width chars
    return false;
}

// 👻 Ghost Mode
function isGhostAllowed(sender) {
    if (!config.GHOST_MODE) return true; // si pa aktive
    return config.SUDO.split(",").includes(sender.split("@")[0]);
}

// 🔒 Admin Shield deja nan GroupEvents.js
// nou sèlman raple li ka travay ansanm ak sa a

module.exports = async (conn, m, isCmd) => {
    try {
        const sender = m.sender;
        const body = m.text || m.message?.conversation || "";

        // 🚫 Ghost Mode Filter
        if (!isGhostAllowed(sender)) return true; // ignore tout pa sudo

        // 🚫 Anti-Bug
        if (isBugMessage(body)) {
            await conn.sendMessage(m.chat, { text: "⚠️ Bug message detected & blocked!" });
            return false;
        }

        // 🚫 Anti-Spam (limit commands)
        if (isCmd && isFlooding(sender)) {
            await conn.sendMessage(m.chat, { text: "⚠️ Slow down! You are spamming." });
            return false;
        }

        return true; // msg la pase
    } catch (e) {
        console.error("Security.js error:", e);
        return true;
    }
};
