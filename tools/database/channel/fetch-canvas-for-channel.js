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
}

export default fetchCanvasForChannel;