import dotenv from "dotenv";
import callGemini from "../../gemini_helpers/gemini-call-helper.js";
// import postMessageInThread from "../tools/post-message-in-thread.js";
import postMessageInThread from "../../tools/slack/post-message-in-thread.js";
import buildMessages from "./messages-builder.js";
import securityHandler from "./security-handler.js";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);// console.log(__filename);
const __dirname = path.dirname(__filename);

dotenv.config({
  path: path.resolve(
    __dirname,
    "../../.env"
  ),
});

export default async function handleAppMention({
  event,
}) {
  // Ignore messages sent by the bot itself
  if (
    !event.user ||
    event.user ===
      process.env
        .SLACK_BOT_USER_ID
  ) {
    return;
  }

  const threadTs =
    event.thread_ts ??
    event.ts;

  // const securityContext =
  //   await securityHandler({
  //     userId: event.user,
  //     channelId:
  //       event.channel,
  //     threadId:
  //       event.thread_ts ??
  //       null,
  //   });

  const messages =
    await buildMessages({
      event,
    });

  const geminiResponse =
    await callGemini(
      messages
    );

  if (
    !geminiResponse ||
    !geminiResponse.choices ||
    geminiResponse.choices
      .length === 0
  ) {
    throw new Error(
      "Invalid response from Gemini"
    );
  }

  const replyText =
    geminiResponse
      .choices[0]
      .message.content;

  await postMessageInThread({
    channel:
      event.channel,
    threadTs,
    text: replyText,
  });
}