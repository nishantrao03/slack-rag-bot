import boltApp from "../../slack/bolt.js";
import dotenv from "dotenv";

dotenv.config();

/**
 * Add multiple users to a Slack channel
 *
 * @param {Object} params
 * @param {string} params.channel - Slack channel ID
 * @param {Array<string>} params.userIds - Array of Slack user IDs
 * @returns {Object} Slack API response
 */
async function addMembersToChannel({ channel, userIds }) {
  try {
    const result = await boltApp.client.conversations.invite({
      token: process.env.SLACK_BOT_TOKEN,
      channel,
      users: userIds.join(","),
    });

    return result;
  } catch (error) {
    const err = new Error(
      `addMembersToChannel failed: ${error && error.message ? error.message : String(error)}`
    );
    err.originalError = error;
    throw err;
  }
}

export default addMembersToChannel;