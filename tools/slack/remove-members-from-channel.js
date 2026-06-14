import boltApp from "../../slack/bolt.js";
import dotenv from "dotenv";

dotenv.config();

/**
 * Remove multiple users from a Slack channel
 *
 * @param {Object} params
 * @param {string} params.channel
 * @param {Array<string>} params.userIds
 * @returns {Array<Object>}
 */
async function removeMembersFromChannel({
  channel,
  userIds,
}) {
  try {
    if (!channel) {
      throw new Error(
        "channel is required."
      );
    }

    if (
      !Array.isArray(
        userIds
      )
    ) {
      throw new Error(
        "userIds must be an array."
      );
    }

    const results = [];

    for (
      const userId
      of userIds
    ) {
      const result =
        await boltApp.client.conversations.kick({
          token:
            process.env.SLACK_BOT_TOKEN,
          channel,
          user:
            userId,
        });

      results.push({
        userId,
        removed:
          result.ok,
      });
    }

    return {
      channelId:
        channel,
      removedUsers:
        results,
    };
  } catch (error) {
    const err = new Error(
      `removeMembersFromChannel failed: ${error && error.message ? error.message : String(error)}`
    );
    err.originalError = error;
    throw err;
  }
}

export default removeMembersFromChannel;