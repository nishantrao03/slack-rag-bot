import prisma from "../../../services/db/prisma-client.js";

/**
 * Fetch channels for a project
 *
 * @param {Object} params
 * @param {string} params.projectId
 * @returns {Array<Object>}
 */
async function fetchChannelsForProject({
    projectId,
}) {
    try {
        if (!projectId) {
            throw new Error(
                "projectId is required."
            );
        }

        const channels =
            await prisma.channel.findMany({
                where: {
                    project_id:
                        projectId,
                },
                select: {
                    channel_id:
                        true,
                    name:
                        true,
                    is_private:
                        true,
                    canvas_id:
                        true,
                    created_at:
                        true,
                },
                orderBy: {
                    created_at:
                        "asc",
                },
            });

        return channels.map(
            ({
                channel_id,
                name,
                is_private,
                canvas_id,
                created_at,
            }) => ({
                channelId:
                    channel_id,
                name,
                isPrivate:
                    is_private,
                canvasId:
                    canvas_id,
                createdAt:
                    created_at,
            })
        );
    } catch (error) {
        const err = new Error(
            `fetchChannelsForProject failed: ${error && error.message ? error.message : String(error)}`
        );
        err.originalError = error;
        throw err;
    }
}

export default fetchChannelsForProject;