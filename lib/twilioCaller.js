// lib/twilioCaller.js
const twilio = require('twilio');
const config = require('../config'); // your config reads env
const accountSid = process.env.TWILIO_SID;
const authToken  = process.env.TWILIO_TOKEN;
const fromNumber = process.env.TWILIO_NUMBER; // E.164

if (!accountSid || !authToken || !fromNumber) {
  console.warn('Twilio not fully configured. Set TWILIO_SID, TWILIO_TOKEN, TWILIO_NUMBER in .env');
}

const client = twilio(accountSid, authToken);

/**
 * placeCall - create a Twilio call using twiml (say text).
 * @param {string} to E.164 number like +509XXXXXXXX
 * @param {string} message Text to speak during the call
 */
async function placeCall(to, message = 'This is a test call.') {
  if (!accountSid || !authToken || !fromNumber) {
    throw new Error('Twilio not configured.');
  }
  // Use TwiML directly so no external URL required
  const twiml = `<Response><Say voice="alice">${escapeXml(message)}</Say></Response>`;
  const call = await client.calls.create({
    twiml,
    to,
    from: fromNumber
  });
  return call;
}

function escapeXml(s = '') {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/'/g, '&apos;')
    .replace(/"/g, '&quot;');
}

module.exports = { placeCall };