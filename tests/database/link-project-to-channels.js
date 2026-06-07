// This is a test for tools/database/channel/link-project-to-channels.js. No creation of project.
import linkProjectToChannels from "../../tools/database/channel/link-project-to-channels.js";

async function test() {
    const res = await linkProjectToChannels({   
        projectId: "08cafc23-9bab-4b0e-98c4-9c95ca1dd9e3",
        channels: [
            { channelId: "C0B1QJWMA3E", name: "project-channel-0", isPrivate: false },
            // { channelId: "C0B1AV4BLKU", name: "test-chan-9", isPrivate: true },
        ],
    });
    console.log(res);
}

test();

// To run this test, use the command: node tests/database/link-project-to-channels.js
