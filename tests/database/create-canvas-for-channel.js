import createCanvasForChannel from "../../tools/database/channel/create-canvas-for-channel.js";

async function runTest() {
  try {
    const result = await createCanvasForChannel({
      channelCanvasPairs: [
        {
          channelId: "C0B1AV4BLKU",
          canvasId: "F0B7B3VNFMG",
        },
        {
          channelId: "C0B1EGX7KCL",
          canvasId: "F0B858LGJ3A",
        },
      ],
    });

    console.log(result);
  }
  catch (error) {
    console.error(error);
  }
}

runTest();

// To run this test, use the command: node tests/database/create-canvas-for-channel.js