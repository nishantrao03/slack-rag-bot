import prisma from "../../../services/db/prisma-client.js";

/**
 * Store canvas IDs for channels.
 *
 * @param {Object} params
 * @param {Array} params.channelCanvasPairs - Channel and canvas ID pairs
 * @returns {Promise<Object>}
 */
async function createCanvasForChannel({
  channelCanvasPairs,
}) {
  try {
    const updateOperations = channelCanvasPairs.map(
      ({ channelId, canvasId }) =>
        prisma.channel.update({
          where: {
            channel_id: channelId,
          },
          data: {
            canvas_id: canvasId,
          },
        })
    );

    const channels = await prisma.$transaction(updateOperations);

    return channels;
  } catch (error) {
    const err = new Error(
      `createCanvasForChannel failed: ${error && error.message ? error.message : String(error)}`
    );
    err.originalError = error;
    throw err;
  }
}

export default createCanvasForChannel;