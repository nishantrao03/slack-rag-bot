import webClient from "../../slack/web_client.js";

/**
 * Fetch all messages belonging to a Slack thread
 * @param {Object} params
 * @param {string} params.channel - Slack channel ID
 * @param {string} params.threadTs - Thread timestamp
 */
export default async function getThreadReplies({ channel, threadTs }) {
  try {
    const response = await webClient.conversations.replies({
      channel,
      ts: threadTs
    });

    if (!response.ok) {
      throw new Error("Failed to fetch thread replies");
    }

    return response.messages || [];
  } catch (error) {
    const err = new Error(
      `getThreadReplies failed: ${error && error.message ? error.message : String(error)}`
    );
    err.originalError = error;
    throw err;
  }
}
