import boltApp from "../../slack/bolt.js";
import dotenv from 'dotenv';
dotenv.config();

/**
 * Post a message to a Slack channel using the bot token
 *
 * @param {Object} params
 * @param {string} params.channel - Slack channel ID
 * @param {string} params.text - Message text to post
 * @returns {Object} Slack API response
 */
export async function postMessage({ channel, text }) {
  try {
    const result = await boltApp.client.chat.postMessage({
      token: process.env.SLACK_BOT_TOKEN,
      channel,
      text,
    });

    return result;
  } catch (error) {
    const err = new Error(
      `postMessage failed: ${error && error.message ? error.message : String(error)}`
    );
    err.originalError = error;
    throw err;
  }
}

export default postMessage;