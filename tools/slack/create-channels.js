import boltApp from "../../slack/bolt.js";
import dotenv from "dotenv";

dotenv.config();

/**
 * Create multiple Slack channels
 *
 * @param {Object} params
 * @param {Array<{name: string, isPrivate?: boolean}>} params.channels
 * @returns {Array} Slack API responses
 */
async function createChannels({ channels }) {
  const results = [];

  for (const channel of channels) {
    const res = await boltApp.client.conversations.create({
      token: process.env.SLACK_BOT_TOKEN,
      name: channel.name,
      is_private: channel.isPrivate ?? false,
    });

    results.push(res);
  }

  return results;
}

export default createChannels;