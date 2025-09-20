const { cmd } = require("../command");

cmd({
    pattern: "technologia",
    alias: ["tech", "technologyia"],
    desc: "Send the Technologia meme audio",
    category: "utility",
    react: "😂",
    filename: __filename
}, 
async (conn, mek, m, { from, reply }) => {
    try {
        await conn.sendMessage(from, {
            audio: { url: "https://files.catbox.moe/fac856.mp3" },
            mimetype: "audio/mpeg",
            ptt: false
        }, { quoted: mek });
    } catch (e) {
        console.error("Error sending audio:", e);
        await reply("❌ Pa kapab voye odyo a. Eseye ankò pita.");
    }
});
