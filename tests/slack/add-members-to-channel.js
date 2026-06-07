import addMembersToChannel from "../../tools/slack/add-members-to-channel.js";

async function test() {
  const res = await addMembersToChannel({
    channel: "C0B1QJWMA3E",
    userIds: ["U0AC0M1S90W"]
  });

  console.log(res);
}

test();

// To run this test, use the command: node tests/slack/add-members-to-channel.js
