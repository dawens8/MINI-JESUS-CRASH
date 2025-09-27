// Credits: DAWENS-BOY96 - jesus-crash-v1 💜
// Channel: https://whatsapp.com/channel/0029VbCHd5V1dAw132PB7M1B

const { isJidGroup } = require('@whiskeysockets/baileys');
const config = require('../config');

const fallbackPPs = [
    'https://i.ibb.co/KhYC4FY/1221bc0bdd2354b42b293317ff2adbcf-icon.png',
    'https://i.ibb.co/KhYC4FY/1221bc0bdd2354b42b293317ff2adbcf-icon.png',
    'https://i.ibb.co/KhYC4FY/1221bc0bdd2354b42b293317ff2adbcf-icon.png',
];

const GroupEvents = async (conn, update) => {
    try {
        if (!isJidGroup(update.id)) return;

        const metadata = await conn.groupMetadata(update.id);
        const participants = update.participants || [];
        const desc = metadata.desc || "No description available.";
        const memberCount = metadata.participants.length;

        let groupPP;
        try {
            groupPP = await conn.profilePictureUrl(update.id, 'image');
        } catch {
            groupPP = fallbackPPs[Math.floor(Math.random() * fallbackPPs.length)];
        }

        for (const num of participants) {
            const userName = num.split("@")[0];
            const timestamp = new Date().toLocaleString();

            // WELCOME EVENT
            if (update.action === "add" && config.WELCOME) {
                const welcomeMsg = `╭─〔 🤖 *${config.BOT_NAME}* 〕\n` +
                    `├─ 🎉 Welcome @${userName} to *${metadata.subject}*\n` +
                    `├─ You are member #${memberCount}\n` +
                    `├─ ⏰ Joined at: ${timestamp}\n` +
                    `╰─ Please read the group description below 👇\n\n` +
                    `╭──〔 📜 Group Description 〕\n` +
                    `├─ ${desc}\n` +
                    `╰─🚀 Powered by ${config.BOT_NAME}`;

                await conn.sendMessage(update.id, {
                    image: { url: groupPP },
                    caption: welcomeMsg,
                    mentions: [num]
                });

            // GOODBYE EVENT
            } else if (update.action === "remove" && config.GOODBYE) {
                const goodbyeMsg = `╭─〔 🤖 *${config.BOT_NAME}* 〕\n` +
                    `├─ 😔 Goodbye @${userName}\n` +
                    `├─ ⏰ Left at: ${timestamp}\n` +
                    `├─ Remaining members: ${memberCount}\n` +
                    `╰─🚀 Powered by ${config.BOT_NAME}`;

                await conn.sendMessage(update.id, {
                    image: { url: groupPP },
                    caption: goodbyeMsg,
                    mentions: [num]
                });

            // DEMOTE EVENT
            } else if (update.action === "demote") {
                const demoter = update.author.split("@")[0];

                if (!config.SUDO.split(",").includes(demoter) && config.SECURITY_ALERT) {
                    // Unauthorized demotion attempt
                    const alertMsg = `╭─〔 🚨 *SECURITY ALERT* 🚨 〕\n` +
                        `├─ ⚠️ Unauthorized demotion detected!\n` +
                        `├─ 👤 Target: @${userName}\n` +
                        `├─ 🛑 Action by: @${demoter}\n` +
                        `├─ ⏰ Time: ${timestamp}\n` +
                        `╰─🔒 Result: @${demoter} has been *removed* for illegal admin action.\n\n` +
                        `🚀 Powered by ${config.BOT_NAME}`;

                    await conn.sendMessage(update.id, {
                        text: alertMsg,
                        mentions: [num, update.author]
                    });

                    await conn.groupParticipantsUpdate(update.id, [update.author], "remove");
                } else if (config.ADMIN_EVENTS) {
                    // Normal demotion log
                    await conn.sendMessage(update.id, {
                        text: `╭─〔 ⚠️ *Admin Event* 〕\n` +
                              `├─ @${demoter} demoted @${userName}\n` +
                              `├─ ⏰ Time: ${timestamp}\n` +
                              `├─ 📌 Group: ${metadata.subject}\n` +
                              `╰─🚀 Powered by ${config.BOT_NAME}`,
                        mentions: [update.author, num]
                    });
                }

            // PROMOTE EVENT
            } else if (update.action === "promote") {
                const promoter = update.author.split("@")[0];

                if (!config.SUDO.split(",").includes(promoter) && config.SECURITY_ALERT) {
                    // Unauthorized promotion attempt
                    const alertMsg = `╭─〔 🚨 *SECURITY ALERT* 🚨 〕\n` +
                        `├─ ⚠️ Unauthorized promotion detected!\n` +
                        `├─ 👤 Target: @${userName}\n` +
                        `├─ 🛑 Action by: @${promoter}\n` +
                        `├─ ⏰ Time: ${timestamp}\n` +
                        `╰─🔒 Result: @${promoter} has been *removed* for illegal admin action.\n\n` +
                        `🚀 Powered by ${config.BOT_NAME}`;

                    await conn.sendMessage(update.id, {
                        text: alertMsg,
                        mentions: [num, update.author]
                    });

                    await conn.groupParticipantsUpdate(update.id, [update.author], "remove");
                } else if (config.ADMIN_EVENTS) {
                    // Normal promotion log
                    await conn.sendMessage(update.id, {
                        text: `╭─〔 🎉 *Admin Event* 〕\n` +
                              `├─ @${promoter} promoted @${userName}\n` +
                              `├─ ⏰ Time: ${timestamp}\n` +
                              `├─ 📌 Group: ${metadata.subject}\n` +
                              `╰─🚀 Powered by ${config.BOT_NAME}`,
                        mentions: [update.author, num]
                    });
                }
            }
        }
    } catch (err) {
        console.error('GroupEvents Error:', err);
    }
};

module.exports = GroupEvents;
