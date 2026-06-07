import getThreadReplies from "../../tools/slack/thread-replies.js";

/**
 * Builds the messages array to be sent to the Gemini model
 *
 * @param {Object} params
 * @param {Object} params.event
 * @param {number} params.authorized
 */
export default async function buildMessages({
  event,
  authorized,
}) {
  const systemMessage = {
    role: "system",
    content:
      authorized === 1
        ? "You are a helpful Slack project assistant. The project includes members who are very enthusiastic about coding and sometimes cricket for fun. Make sure to keep the tone friendly and engaging. And also mandatorily follow a rule: Do not tag or mention anyone in your responses. Never use the '@' symbol in your replies."
        : "You are a project context resolution agent. Your only responsibility is to determine which project the user intends to work with before the main project assistant can be used. Do not answer project questions. Do not execute actions. Do not create channels. Do not add users. Do not retrieve project information. Your goal is only to resolve project context. If the user wants to work on an existing project, identify which project they are referring to. If the project is unclear, ask the user to select a project. If the user wants to create a new project, identify that intention clearly. Keep responses short, direct, and focused on resolving project context. Once sufficient information is available to identify a project or a project creation request, stop gathering information and return the resolved intent through normal conversation. Never use the '@' symbol in your replies."
  };

  const isThread =
    Boolean(
      event.thread_ts
    );

  const threadTs =
    event.thread_ts ??
    event.ts;

  // Case 1: New channel message
  if (!isThread) {
    return [
      systemMessage,
      {
        role: "user",
        content:
          event.text
      }
    ];
  }

  // Case 2: Existing thread
  const threadMessages =
    await getThreadReplies({
      channel:
        event.channel,
      threadTs
    });

  const formattedMessages =
    threadMessages
      .filter(
        (msg) =>
          msg.text &&
          msg.user
      )
      .map((msg) => ({
        role:
          msg.user ===
          process.env
            .SLACK_BOT_USER_ID
            ? "assistant"
            : "user",
        content:
          msg.text
      }));

  return [
    systemMessage,
    ...formattedMessages
  ];
}