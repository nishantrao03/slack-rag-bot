import boltApp from "../../slack/bolt.js";
import dotenv from "dotenv";

dotenv.config();

/**
 * Create a channel canvas.
 *
 * @param {Object} params
 * @param {string} params.channelId - Slack channel ID
 * @param {string} params.content - Canvas content
 * @returns {Object} Slack API response
 */
async function createChannelCanvas({
  channelId,
  content,
}) {
  try {
    if (!channelId) {
      throw new Error(
        "channelId is required."
      );
    }

    if (!content) {
      throw new Error(
        "content is required."
      );
    }

    const result = await boltApp.client.apiCall(
      "conversations.canvases.create",
      {
        token: process.env.SLACK_BOT_TOKEN,
        channel_id: channelId,
        document_content: {
          type: "markdown",
          markdown: content,
        },
      }
    );

    return result;
  } catch (error) {
    const err = new Error(
      `createChannelCanvas failed: ${error && error.message ? error.message : String(error)}`
    );
    err.originalError = error;
    throw err;
  }
}

export default createChannelCanvas;