// This file is a test for tools/slack/post-message.js.
import postMessage from "../../tools/slack/post-message.js";
async function testPostMessage() {
  console.log("Running postMessage test...");
  const testChannel = "C0B1EGX7KCL";
  const testText = "https://nishants-workspace-co.slack.com/files/U0AC0M1S90W/F0B77BXDF0D/student_marks.xlsx";
  await postMessage({ channel: testChannel, text: testText });
}
testPostMessage();

// To run this test, use the command: node tests/slack/post-message.js