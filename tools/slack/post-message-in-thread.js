// import boltApp from "../../slack/bolt.js";
import boltApp from "../../slack/bolt.js";
import dotenv from 'dotenv';
dotenv.config();

/**
 * Post a message as a reply inside an existing Slack thread
 *
 * @param {Object} params
 * @param {string} params.channel - Slack channel ID
 * @param {string} params.threadTs - Timestamp of the parent message
 * @param {string} params.text - Message text to post in the thread
 * @returns {Object} Slack API response
 */
async function postMessageInThread({ channel, threadTs, text }) {
  const result = await boltApp.client.chat.postMessage({
    token: process.env.SLACK_BOT_TOKEN,
    channel,
    text,
    thread_ts: threadTs,
  });

  return result;
}

export default postMessageInThread;
