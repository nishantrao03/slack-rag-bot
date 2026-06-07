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

  const channels = await prisma.$transaction(
    updateOperations
  );

  return channels;
}

export default createCanvasForChannel;