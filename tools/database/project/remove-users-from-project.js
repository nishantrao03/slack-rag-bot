import prisma from "../../../services/db/prisma-client.js";

/**
 * Remove users from a project
 *
 * @param {Object} params
 * @param {string} params.projectId
 * @param {Array<string>} params.userIds
 * @returns {Object}
 */
async function removeUsersFromProject({
    projectId,
    userIds,
}) {
    try {
        if (!projectId) {
            throw new Error(
                "projectId is required."
            );
        }

        if (
            !Array.isArray(
                userIds
            )
        ) {
            throw new Error(
                "userIds must be an array."
            );
        }

        const result =
            await prisma.projectMember.deleteMany({
                where: {
                    project_id:
                        projectId,
                    user_id: {
                        in:
                            userIds,
                    },
                },
            });

        return {
            projectId,
            requestedUserIds:
                userIds,
            removedCount:
                result.count,
        };
    } catch (error) {
        const err = new Error(
            `removeUsersFromProject failed: ${error && error.message ? error.message : String(error)}`
        );
        err.originalError = error;
        throw err;
    }
}

export default removeUsersFromProject;