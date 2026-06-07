import createChannels from "../../tools/slack/create-channels.js";

async function test() {
  const res = await createChannels({
    channels: [
      { name: "project-channel-0", isPrivate: false }
      
    ],
  });

  console.log(res);
}

test();

// To run this test, use the command: node tests/slack/create_channels.js