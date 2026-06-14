import prisma from "../../../services/db/prisma-client.js";

/**
 * Fetch canvas IDs for channels.
 *
 * @param {Object} params
 * @param {string[]} params.channelIds - Channel IDs
 * @returns {Promise<Array>}
 */
async function fetchCanvasForChannel({
  channelIds,
}) {
  try {
    const channels = await prisma.channel.findMany({
      where: {
        channel_id: {
          in: channelIds,
        },
      },
      select: {
        channel_id: true,
        canvas_id: true,
      },
    });

    return channels;
  } catch (error) {
    const err = new Error(
      `fetchCanvasForChannel failed: ${error && error.message ? error.message : String(error)}`
    );
    err.originalError = error;
    throw err;
  }
}

export default fetchCanvasForChannel;