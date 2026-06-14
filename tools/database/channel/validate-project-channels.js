import prisma from "../../../services/db/prisma-client.js";

/**
 * Validate channels for a project
 *
 * @param {Object} params
 * @param {string} params.projectId
 * @param {Array<string>} params.channelIds
 * @returns {Object}
 */
async function validateProjectChannels({
    projectId,
    channelIds,
}) {
    if (!projectId) {
        throw new Error(
            "projectId is required."
        );
    }

    if (
        !Array.isArray(
            channelIds
        )
    ) {
        throw new Error(
            "channelIds must be an array."
        );
    }
    try {
        const channels = await prisma.channel.findMany({
            where: {
                project_id: projectId,
                channel_id: {
                    in: channelIds,
                },
            },
            select: {
                channel_id: true,
            },
        });

        const validChannelIds = channels.map(({ channel_id }) => channel_id);

        const validChannelSet = new Set(validChannelIds);

        const invalidChannelIds = channelIds.filter((channelId) => !validChannelSet.has(channelId));

        return {
            validChannelIds,
            invalidChannelIds,
        };
    } catch (error) {
        const err = new Error(
            `validateProjectChannels failed: ${error && error.message ? error.message : String(error)}`
        );
        err.originalError = error;
        throw err;
    }
}

export default validateProjectChannels;