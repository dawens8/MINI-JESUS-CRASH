const { cmd } = require('../command');
const { Sticker, StickerTypes } = require('wa-sticker-formatter');

cmd({
  pattern: '🤚🏻',
  desc: 'Re-send any sticker or image as sticker (with custom packname)',
  category: 'main',
  react: '🎭',
  filename: __filename
}, async (bot, mek, m, { reply }) => {
  try {
    const quoted = mek.quoted;

    if (!quoted || !['stickerMessage', 'imageMessage'].includes(quoted.mtype)) {
      return reply('❌ Reply to a sticker or an image.');
    }

    // telechaje media a (sticker/photo)
    const media = await bot.downloadMediaMessage(quoted);
    if (!media) return reply('❌ Failed to download media.');

    // 🏷️ mete packname ak author
    const packname = '𓄂⍣⃝𝐆𝚯𝐃𝄟✮͢≛𝐃𝐀𝐖𝐄𝐍𝐒𝄟✮⃝🧭𓄂';
    const author = '☠️';

    const sticker = new Sticker(media, {
      pack: packname,
      author,
      type: StickerTypes.FULL, // FULL = full screen, CROPPED = fit crop
      quality: 100,
    });

    const stickerBuffer = await sticker.toBuffer();

    await bot.sendMessage(mek.chat, { sticker: stickerBuffer }, { quoted: mek });

  } catch (err) {
    console.error('[TAKE ERROR]', err);
    reply('❌ An error occurred while converting.');
  }
});
