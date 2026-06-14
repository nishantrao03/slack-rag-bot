import prisma from "../../../services/db/prisma-client.js";

/**
 * Link multiple Slack channels to a project in DB
 *
 * @param {Object} params
 * @param {string} params.projectId
 * @param {Array<{channelId: string, name: string, isPrivate: boolean}>} params.channels
 * @returns {Array} Created channel records
 */
async function linkProjectsToChannel({ projectId, channels }) {
  try {
    const dataToInsert = channels.map((channel) => ({
      channel_id: channel.channelId,
      name: channel.name,
      is_private: channel.isPrivate,
      project_id: projectId,
    }));

    const createdChannels = await prisma.channel.createManyAndReturn({
      data: dataToInsert,
    });

    return createdChannels;
  } catch (error) {
    const err = new Error(
      `linkProjectsToChannel failed: ${error && error.message ? error.message : String(error)}`
    );
    err.originalError = error;
    throw err;
  }
}

export default linkProjectsToChannel;