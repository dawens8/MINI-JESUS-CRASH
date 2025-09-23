// Credits DAWENS-BOY96 - jesus-crash-v1 💜 
// https://whatsapp.com/channel/0029VbCHd5V1dAw132PB7M1B

const { isJidGroup } = require('@whiskeysockets/baileys');
const config = require('../config');

const ppUrls = [
    'https://i.ibb.co/KhYC4FY/1221bc0bdd2354b42b293317ff2adbcf-icon.png',
    'https://i.ibb.co/KhYC4FY/1221bc0bdd2354b42b293317ff2adbcf-icon.png',
    'https://i.ibb.co/KhYC4FY/1221bc0bdd2354b42b293317ff2adbcf-icon.png',
];

const GroupEvents = async (conn, update) => {
    try {
        const isGroup = isJidGroup(update.id);
        if (!isGroup) return;

        const metadata = await conn.groupMetadata(update.id);
        const participants = update.participants;
        const desc = metadata.desc || "No Description";
        const groupMembersCount = metadata.participants.length;

        let ppUrl;
        try {
            ppUrl = await conn.profilePictureUrl(update.id, 'image');
        } catch {
            ppUrl = ppUrls[Math.floor(Math.random() * ppUrls.length)];
        }

        for (const num of participants) {
            const userName = num.split("@")[0];
            const timestamp = new Date().toLocaleString();

            // WELCOME
            if (update.action === "add" && config.WELCOME === "true") {
                const WelcomeText = `╭─〔 *🤖 ${config.BOT_NAME}* 〕\n` +
                    `├─▸ *Welcome @${userName} to ${metadata.subject}* 🎉\n` +
                    `├─ *You are member number ${groupMembersCount}* \n` +
                    `├─ *Time joined:* ${timestamp}\n` +
                    `╰─➤ *Please read group description*\n\n` +
                    `╭──〔 📜 *Group Description* 〕\n` +
                    `├─ ${desc}\n` +
                    `╰─🚀 *Powered by ${config.BOT_NAME}*`;

                await conn.sendMessage(update.id, {
                    image: { url: ppUrl },
                    caption: WelcomeText,
                    mentions: [num]
                });

            // GOODBYE
            } else if (update.action === "remove" && config.GOODBYE === "true") {
                const GoodbyeText = `╭─〔 *🤖 ${config.BOT_NAME}* 〕\n` +
                    `├─▸ *Goodbye @${userName}* 😔\n` +
                    `├─ *Time left:* ${timestamp}\n` +
                    `├─ *Members remaining:* ${groupMembersCount}\n` +
                    `╰─➤ *We'll miss you!*\n\n` +
                    `╰─🚀 *Powered by ${config.BOT_NAME}*`;

                await conn.sendMessage(update.id, {
                    image: { url: ppUrl },
                    caption: GoodbyeText,
                    mentions: [num]
                });

            // DEMOTE
            } else if (update.action === "demote") {
                const demoter = update.author.split("@")[0];

                if (!config.SUDO.split(",").includes(update.author.split("@")[0])) {
                    // 🚨 Unauthorized Demote
                    const AlertMsg = `╭─〔 🚨 *SECURITY ALERT* 🚨 〕
│
├─ ⚠️ *UNAUTHORIZED DEMOTE DETECTED!*
│
├─ 👤 *Target:* @${userName}
├─ 🛑 *Action By:* @${demoter}
├─ ⏰ *Time:* ${timestamp}
│
╰─🔒 *Result:* User @${demoter} has been *KICKED* for illegal admin action.
\n🚀 *Powered by ${config.BOT_NAME}*`;

                    await conn.sendMessage(update.id, {
                        text: AlertMsg,
                        mentions: [num, update.author]
                    });

                    await conn.groupParticipantsUpdate(update.id, [update.author], "remove");
                } else if (config.ADMIN_ACTION === "true") {
                    // Normal Demote Log
                    await conn.sendMessage(update.id, {
                        text: `╭─〔 *⚠️ Admin Event* 〕\n` +
                              `├─ @${demoter} demoted @${userName}\n` +
                              `├─ *Time:* ${timestamp}\n` +
                              `├─ *Group:* ${metadata.subject}\n` +
                              `╰─➤ *Powered by ${config.BOT_NAME}*`,
                        mentions: [update.author, num]
                    });
                }

            // PROMOTE
            } else if (update.action === "promote") {
                const promoter = update.author.split("@")[0];

                if (!config.SUDO.split(",").includes(update.author.split("@")[0])) {
                    // 🚨 Unauthorized Promote
                    const AlertMsg = `╭─〔 🚨 *SECURITY ALERT* 🚨 〕
│
├─ ⚠️ *UNAUTHORIZED PROMOTE DETECTED!*
│
├─ 👤 *Target:* @${userName}
├─ 🛑 *Action By:* @${promoter}
├─ ⏰ *Time:* ${timestamp}
│
╰─🔒 *Result:* User @${promoter} has been *KICKED* for illegal admin action.
\n🚀 *Powered by ${config.BOT_NAME}*`;

                    await conn.sendMessage(update.id, {
                        text: AlertMsg,
                        mentions: [num, update.author]
                    });

                    await conn.groupParticipantsUpdate(update.id, [update.author], "remove");
                } else if (config.ADMIN_ACTION === "true") {
                    // Normal Promote Log
                    await conn.sendMessage(update.id, {
                        text: `╭─〔 *🎉 Admin Event* 〕\n` +
                              `├─ @${promoter} promoted @${userName}\n` +
                              `├─ *Time:* ${timestamp}\n` +
                              `├─ *Group:* ${metadata.subject}\n` +
                              `╰─➤ *Powered by ${config.BOT_NAME}*`,
                        mentions: [update.author, num]
                    });
                }
            }
        }
    } catch (err) {
        console.error('Group event error:', err);
    }
};

module.exports = GroupEvents;
