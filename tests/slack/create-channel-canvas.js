import createChannelCanvas from "../../tools/slack/create-channel-canvas.js";

async function runTest() {
  try {
    const result = await createChannelCanvas({
      channelId: "C0B1AV4BLKU",
      content: `
# Backend Development

This channel is responsible for backend development.

## Responsibilities

- Slack Integration
- RAG Ingestion
- Vector Retrieval

## Important Documents

https://nishants-workspace-co.slack.com/files/U0AC0M1S90W/F0B6VK7JAB1/project_guidelines__2_.pdf

https://docs.google.com/document/d/1EsgTkEmMcWZ0-ikNUVKyWEiZzG090jv4dmbSbd5l2U0/edit?tab=t.0#heading=h.fro9j2yfigy6
      `,
    });

    console.log(result);
  }
  catch (error) {
    console.error(error);
  }
}

runTest();

// To run this test, use the command: node tests/slack/create-channel-canvas.js