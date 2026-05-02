import boltApp from "../bolt.js";
import dotenv from 'dotenv';
dotenv.config();

/**
 * Fetch channel messages along with their thread replies
 *
 * @param {Object} params
 * @param {string} params.channel - Slack channel ID
 * @returns {Array} List of messages with optional thread replies
 */
export async function getChannelHistory({ channel }) {
  const historyResponse = await boltApp.client.conversations.history({
    token: process.env.SLACK_BOT_TOKEN,
    channel,
    limit: 50,
  });

  if (!historyResponse.ok) {
    throw new Error(historyResponse.error);
  }

  const messagesWithThreads = [];

  for (const message of historyResponse.messages) {
    const messageData = {
      user: message.user,
      text: message.text,
      ts: message.ts,
      threadReplies: [],
    };

    if (message.thread_ts) {
      const repliesResponse = await boltApp.client.conversations.replies({
        token: process.env.SLACK_BOT_TOKEN,
        channel,
        ts: message.thread_ts,
      });

      if (!repliesResponse.ok) {
        throw new Error(repliesResponse.error);
      }

      for (const reply of repliesResponse.messages.slice(1)) {
        messageData.threadReplies.push({
          user: reply.user,
          text: reply.text,
          ts: reply.ts,
        });
        console.log("Fetched reply:", reply);
      }
    }

    messagesWithThreads.push(messageData);
  }

  return messagesWithThreads;
}

export default getChannelHistory;
