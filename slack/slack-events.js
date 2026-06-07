import dotenv from "dotenv";
import pkg from '@slack/bolt';
const { App, ExpressReceiver } = pkg;

import handleAppMention from "./events/message-handler.js";

// Initialize environment variables to ensure access to secrets immediately upon import
dotenv.config();

/**
 * Initialize Slack Express receiver for Events API
 */
const receiver = new ExpressReceiver({
  signingSecret: process.env.SLACK_SIGNING_SECRET,
});

receiver.app.use((req, res, next) => {
  console.log("Slack request received");
  next();
});

/**
 * Initialize Slack Bolt app using Express receiver
 */
const boltApp = new App({
  token: process.env.SLACK_BOT_TOKEN,
  receiver,
});

boltApp.event("app_mention", async (args) => {
  const { event } = args;
    
  console.log("Bot mention received:", {
    channel: event.channel,
    user: event.user,
    text: event.text,
    threadTs: event.thread_ts,
    files: event.files,
  });
  await handleAppMention(args);
});

boltApp.event("message", async (args) => {
  const { event } = args;

  if (
    event.channel_type === "im" &&
    !event.bot_id
  ) {
    console.log("DM received:", {
      channel: event.channel,
      user: event.user,
      text: event.text,
      threadTs: event.thread_ts,
      files: event.files,
    });

    await handleAppMention(args);
  }
});

// Export the Express application instance from the receiver
export default receiver.app;