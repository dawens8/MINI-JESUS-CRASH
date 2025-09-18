// Credits DAWENS-BOY96 - jesus-crash-v1 💜 
// https://whatsapp.com/channel/0029VbCHd5V1dAw132PB7M1B

const { isJidGroup } = require('@whiskeysockets/baileys');
const config = require('../config');

const fallbackPP = 'https://i.ibb.co/KhYC4FY/1221bc0bdd2354b42b293317ff2adbcf-icon.png';

const getContextInfo = (m) => ({
    mentionedJid: [m.sender],
    forwardingScore: 999,
    isForwarded: true,
    forwardedNewsletterMessageInfo: {
        newsletterJid: '120363419768812867@newsletter',
        newsletterName: 'MINI-JESUS-CRASH',
        serverMessageId: 143,
    },
});

async function safeSendMessage(conn, jid, msg) {
  try {
    await conn.sendMessage(jid, msg);
  } catch (err) {
    console.error('Failed to send message, retrying...', err);
    try {
      await new Promise(r => setTimeout(r, 1500));
      await conn.sendMessage(jid, msg);
    } catch (e) {
      console.error('Retry failed:', e);
    }
  }
}

// Se sèlman sudo sa yo ki gen dwa promote/demote
const allowedAdmins = new Set([
  '13058962443@s.whatsapp.net',
  '50942241547@s.whatsapp.net',
  '18573917861@s.whatsapp.net',
]);

const GroupEvents = async (conn, update) => {
    try {
        if (!isJidGroup(update.id) || !Array.isArray(update.participants)) return;

        const metadata = await conn.groupMetadata(update.id);
        const groupName = metadata.subject;
        const groupDesc = metadata.desc || 'No description available.';
        const memberCount = metadata.participants.length;

        let groupPP;
        try {
            groupPP = await conn.profilePictureUrl(update.id, 'image');
        } catch {
            groupPP = fallbackPP;
        }

        const groupAdmins = metadata.participants
            .filter(p => p.admin !== null)
            .map(p => p.id);

        for (const user of update.participants) {
            const username = user.split('@')[0];
            const time = new Date().toLocaleString();
            let userPP;

            try {
                userPP = await conn.profilePictureUrl(user, 'image');
            } catch {
                userPP = groupPP;
            }

            const sendMessage = async (caption, withImage = false, mentions = [user]) => {
                const contextInfo = {
                    mentionedJid: mentions,
                    forwardingScore: 999,
                    isForwarded: true,
                    forwardedNewsletterMessageInfo: {
                        newsletterJid: '120363419768812867@newsletter',
                        newsletterName: 'MINI-JESUS-CRASH',
                        serverMessageId: 143,
                    },
                };

                let msg;
                if (withImage) {
                    msg = {
                        image: { url: userPP },
                        caption,
                        contextInfo,
                        mentions,
                    };
                } else {
                    msg = {
                        text: caption,
                        contextInfo,
                        mentions,
                    };
                }
                await safeSendMessage(conn, update.id, msg);
            };

            // Byenveni
            if (update.action === 'add' && config.WELCOME === 'true') {
                const welcome = 
`┏━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃   🎉 𝗪𝗘𝗟𝗖𝗢𝗠𝗘 𝗡𝗘𝗪 𝗠𝗘𝗠𝗕𝗘𝗥 🎉
┣━━━━━━━━━━━━━━━━━━━━━━━━━━━┫
┃ 👤 User      : @${username}
┃ 📅 Joined    : ${time}
┃ 👥 Members   : ${memberCount}
┃ 🏷️ Group     : ${groupName}
┣━━━━━━━━━━━━━━━━━━━━━━━━━━━┫
┃ 📋 Description:
┃ ${groupDesc.length > 70 ? groupDesc.slice(0, 70) + '...' : groupDesc}
┣━━━━━━━━━━━━━━━━━━━━━━━━━━━┫
┃ 💬 Please read the group rules and enjoy your stay!
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━┛`;

                await sendMessage(welcome, true);

            // Goodbye
            } else if (update.action === 'remove' && config.WELCOME === 'true') {
                const goodbye = 
`╭─────────────◇
│ 👋 𝐌𝐄𝐌𝐁𝐄𝐑 𝐄𝐗𝐈𝐓𝐄𝐃
├─────────────────────
│ 👤 ᴜꜱᴇʀ: @${username}
│ 🕓 ʟᴇꜰᴛ ᴀᴛ: ${time}
│ 👥 ɴᴏᴡ ᴍᴇᴍʙᴇʀꜱ: ${memberCount}
╰───────────────◆`;

                await sendMessage(goodbye, true);

            // Promote
            } else if (update.action === 'promote' && config.ADMIN_EVENTS === 'true') {
                const promoter = update.author ? update.author.split('@')[0] : 'Inconnu';

                if (!allowedAdmins.has(update.author)) {
                    await conn.groupParticipantsUpdate(update.id, [user], 'demote');
                    await conn.groupParticipantsUpdate(update.id, [update.author], 'remove');

                    const antiPromoteMsg = 
`🚫 *UNAUTHORIZED PROMOTE ATTEMPT!*
👤 Target: @${username}
👑 By: @${promoter}
❌ User has been *KICKED* for unauthorized promotion attempt.
🔐 Only *SUDO* can manage admin privileges.`;

                    await sendMessage(antiPromoteMsg, false, [user, update.author].filter(Boolean));
                    continue;
                }

                const promoteMsg = 
`🎖️ *USER PROMOTED*
👤 @${username}
👑 By: @${promoter}
🕒 Time: ${time}`;

                await sendMessage(promoteMsg, false, [user, update.author].filter(Boolean));

            // Demote
            } else if (update.action === 'demote' && config.ADMIN_EVENTS === 'true') {
                const demoter = update.author ? update.author.split('@')[0] : 'Inconnu';

                if (!allowedAdmins.has(update.author)) {
                    await conn.groupParticipantsUpdate(update.id, [user], 'promote');
                    await conn.groupParticipantsUpdate(update.id, [update.author], 'remove');

                    const antiDemoteMsg = 
`🚫 *UNAUTHORIZED DEMOTE ATTEMPT!*
👤 Target: @${username}
👎 By: @${demoter}
❌ User has been *KICKED* for unauthorized demotion.
🔐 Only *SUDO* can manage admin privileges.`;

                    await sendMessage(antiDemoteMsg, false, [user, update.author].filter(Boolean));
                    continue;
                }

                const demoteMsg = 
`⚠️ *USER DEMOTED*
👤 @${username}
😞 By: @${demoter}
🕒 Time: ${time}`;

                await sendMessage(demoteMsg, false, [user, update.author].filter(Boolean));
            }
        }
    } catch (err) {
        console.error('Group event error:', err);
    }
};

module.exports = GroupEvents;