const config = require('../config')
const { cmd, commands } = require('../command')
const { getBuffer, getGroupAdmins, getRandom, h2k, isUrl, Json, runtime, sleep, fetchJson } = require('../lib/functions')

cmd({
    pattern: "tagall",
    react: "⚡",
    alias: ["😹", "gc_tagall"],
    desc: "Dark styled Tag All",
    category: "group",
    use: ".tagall [message]",
    filename: __filename
},
async (conn, mek, m, { from, participants, reply, isGroup, isAdmins, isCreator, args }) => {
    try {
        if (!isGroup) return reply("❌ This command only works in groups!");
        if (!isAdmins && !isCreator) return reply("❌ Only admins or the owner can use this command.");

        let groupInfo = await conn.groupMetadata(from);
        let groupName = groupInfo.subject || "Unnamed Group";
        let totalMembers = participants.length;

        let customMsg = args.length > 0 ? args.join(" ") : "⚠ ATTENTION ALL MEMBERS ⚠";

        let teks = `
╔═══❖•ೋ° °ೋ•❖═══╗
      𝐌𝐈𝐍𝐈-𝐉𝐄𝐒𝐔𝐒-𝐂𝐑𝐀𝐒𝐇
╚═══❖•ೋ° °ೋ•❖═══╝

🕷 GROUP : *${groupName}*
🌑 MEMBERS : *${totalMembers}*
⚡ MESSAGE : *${customMsg}*

━━━━━━━━━━━━━━━ DARK BROADCAST ━━━━━━━━━━━━━━━

`;

        for (let mem of participants) {
            teks += `•ೋ°𝐌𝐈𝐍𝐈-𝐉𝐄𝐒𝐔𝐒 @${mem.id.split('@')[0]}\n`;
        }

        teks += `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚔️  POWERED BY: 𝐌𝐈𝐍𝐈-𝐉𝐄𝐒𝐔𝐒-𝐂𝐑𝐀𝐒𝐇  
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`;

        await conn.sendMessage(from, { text: teks, mentions: participants.map(p => p.id) }, { quoted: mek });

    } catch (e) {
        console.error("Dark TagAll Error:", e);
        reply(`❌ Error: ${e.message}`);
    }
});
