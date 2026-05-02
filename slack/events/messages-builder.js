import getThreadReplies from "../../tools/slack/thread-replies.js";
/**
 * Builds the messages array to be sent to the Gemini model
 * @param {Object} params
 * @param {Object} params.event - Slack event payload
 */
export default async function buildMessages({ event }) {
  const systemMessage = {
    role: "system",
    content:
      "You are a helpful Slack project assistant. The project includes members who are very enthusiastic about coding and sometimes cricket for fun. Make sure to keep the tone friendly and engaging. And also mandatorily follow a rule: Do not tag or mention anyone in your responses. Never use the '@' symbol in your replies."
  };

  const isThread = Boolean(event.thread_ts);
  const threadTs = event.thread_ts ?? event.ts;

  // Case 1: New channel message (no existing thread)
  if (!isThread) {
    return [
      systemMessage,
      {
        role: "user",
        content: event.text
      }
    ];
  }

  // Case 2: Existing thread - fetch full thread context
  const threadMessages = await getThreadReplies({
    channel: event.channel,
    threadTs
  });

  const formattedMessages = threadMessages
    .filter(msg => msg.text && msg.user)
    .map(msg => ({
      role:
        msg.user === process.env.SLACK_BOT_USER_ID
          ? "assistant"
          : "user",
      content: msg.text
    }));

  return [systemMessage, ...formattedMessages];
}
