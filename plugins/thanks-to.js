const thanksCommand = async (m, Matrix) => {
    const prefix = "."; // Change this if your bot uses a different prefix
    const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(" ")[0].toLowerCase() : '';

    const validCommands = ['thanks', 'thanksto', 'dev'];
    if (!validCommands.includes(cmd)) return;

    await m.React('👤');

    const message = `
╭─❏ *👑 ABOUT ME 👑*  
│📛 NAME    : ©DAWENS BOY  
│📱 NUMBER  : +989910713754  
│🤖 BOT     : 𝐌𝐈𝐍𝐈-𝐉𝐄𝐒𝐔𝐒-𝐂𝐑𝐀𝐒𝐇  
│────────────────────────────────
│🌍 COUNTRY : Haiti 🇭🇹  
│🎂 AGE     : 14
│🕹️ HOBBY   : Gaming / Coding  
│🎶 MUSIC   : Rap • Kompa • Afro  
│🍔 FOOD    : Pizza & Fritay  
│🎨 COLOR   : Black & Red  
│🎯 FOCUS   : Security • Mods • Bots  
│💡 MOTTO   : "Work Hard, Stay Real"  
│✨ DREAM   : Build my own platform  
│───────────────────  
│🙋‍♂️ SALUT @${m.sender.split("@")[0]}  
╰──────────────────❏
`;

    try {
        await Matrix.sendMessage(m.from, {
            image: { url: 'https://files.catbox.moe/x16nfd.png' },
            caption: message,
            contextInfo: {
                mentionedJid: [m.sender],
                forwardingScore: 1000,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363397722863547@newsletter', // optional
                    newsletterName: 'MINI JESUS',
                    serverMessageId: 143
                }
            }
        }, { quoted: m });

        await m.React("✅");
    } catch (err) {
        console.error("Thanks Command Error:", err);
        await Matrix.sendMessage(m.from, { text: `Error: ${err.message}` }, { quoted: m });
        await m.React("❌");
    }
};

export default thanksCommand;