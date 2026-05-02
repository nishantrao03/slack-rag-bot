import dotenv from "dotenv";
import express from "express";

// Import the configured Slack events application
import slackEventsApp from "./slack/slack-events.js";

dotenv.config();

const SLACK_CHANNEL = process.env.SLACK_CHANNEL;
const PORT = 3000;

/**
 * Initialize Express application
 */
const app = express();

/**
 * Health check endpoint to verify server availability
 */
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

/**
 * Mount Slack Events API endpoint
 */
app.use("/", slackEventsApp);


/**
 * Start Express server on port 3000
 */
app.listen(PORT, () => {
  console.log(`Express server running on port ${PORT}`);
});

/**
 * Execute Slack tool functions to verify functionality
 */
(async () => {
  try {
    // const channelHistory = await getChannelHistory({ channel: SLACK_CHANNEL });
    // console.log("Channel History:", channelHistory);

    // const postResult = await postMessage({
    //   channel: SLACK_CHANNEL,
    //   text: "[Q] - Assistant Query",
    // });
    // console.log("Post Message Result:", postResult);

    // const threadResult = await postMessageInThread({
    //   channel: SLACK_CHANNEL,
    //   threadTs: postResult.ts,
    //   text: "How can I help you today?",
    // });
    // console.log("Post Message in Thread Result:", threadResult);
    console.log("All Slack tool functions executed successfully.");
  } catch (error) {
    console.error("Error:", error);
  }
})();