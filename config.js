const fs = require('fs');
if (fs.existsSync('config.env')) require('dotenv').config({ path: './config.env' });

function toBool(text, fault = 'true') {
  return String(text).toLowerCase() === String(fault).toLowerCase();
}

module.exports = {
  SESSION_ID: process.env.SESSION_ID || "MINI-JESUS-CRASH",
  AUTO_STATUS_SEEN: toBool(process.env.AUTO_STATUS_SEEN, "true"),
  AUTO_STATUS_REPLY: toBool(process.env.AUTO_STATUS_REPLY, "true"),
  AUTO_STATUS_REACT: toBool(process.env.AUTO_STATUS_REACT, "true"),
  AUTO_STATUS_MSG: process.env.AUTO_STATUS_MSG || "*SEEN YOUR STATUS BY MINI-JESUS-CRASH*",

  WELCOME: toBool(process.env.WELCOME, "true"),
  ADMIN_EVENTS: toBool(process.env.ADMIN_EVENTS, "true"),
  ANTI_LINK: toBool(process.env.ANTI_LINK, "true"),

  MENTION_REPLY: toBool(process.env.MENTION_REPLY, "true"),
  MENU_IMAGE_URL: process.env.MENU_IMAGE_URL || "https://files.catbox.moe/x16nfd.png",

  PREFIX: process.env.PREFIX || ".",
  BOT_NAME: process.env.BOT_NAME || "MINI-JESUS-CRASH",
  STICKER_NAME: process.env.STICKER_NAME || "MINI-JESUS-CRASH",

  CUSTOM_REACT: toBool(process.env.CUSTOM_REACT, "false"),
  CUSTOM_REACT_EMOJIS: process.env.CUSTOM_REACT_EMOJIS || "💝,💖,💗,❤️‍🩹,❤️,🧡,💛,💚,💙,💜,🤎,🖤,🤍",

  DELETE_LINKS: toBool(process.env.DELETE_LINKS, "true"),
  OWNER_NUMBER: (process.env.OWNER_NUMBER || "13058962443") + "@s.whatsapp.net",
  OWNER_NAME: process.env.OWNER_NAME || "DAWENS BOY",
  DESCRIPTION: process.env.DESCRIPTION || "*© ᴘᴏᴡᴇʀᴇᴅ by dawens boy*",

  ALIVE_IMG: process.env.ALIVE_IMG || "https://files.catbox.moe/x16nfd.png",
  ALIVE_MSG: process.env.ALIVE_MSG || "> Zinda Hun Yar *MINI-JESUS-CRASH*⚡",

  READ_MESSAGE: toBool(process.env.READ_MESSAGE, "false"),
  AUTO_REACT: toBool(process.env.AUTO_REACT, "false"),
  ANTI_BAD: toBool(process.env.ANTI_BAD, "true"),
  MODE: process.env.MODE || "public",
  ANTI_LINK_KICK: toBool(process.env.ANTI_LINK_KICK, "true"),

  AUTO_VOICE: toBool(process.env.AUTO_VOICE, "false"),
  AUTO_STICKER: toBool(process.env.AUTO_STICKER, "true"),
  AUTO_REPLY: toBool(process.env.AUTO_REPLY, "true"),
  ALWAYS_ONLINE: toBool(process.env.ALWAYS_ONLINE, "false"),
  PUBLIC_MODE: toBool(process.env.PUBLIC_MODE, "true"),
  AUTO_TYPING: toBool(process.env.AUTO_TYPING, "false"),
  READ_CMD: toBool(process.env.READ_CMD, "false"),

  DEV: (process.env.DEV || "50942241547") + "@s.whatsapp.net",
  ANTI_VV: toBool(process.env.ANTI_VV, "true"),
  ANTI_DEL_PATH: process.env.ANTI_DEL_PATH || "same",

  AUTO_RECORDING: toBool(process.env.AUTO_RECORDING, "true"),
  BAILEYS: process.env.BAILEYS || "@whiskeysockets/baileys"
};
