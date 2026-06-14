import prisma from "../../../services/db/prisma-client.js";

/**
 * Change project member roles
 *
 * @param {Object} params
 * @param {Array<Object>} params.users
 * @returns {Object}
 */
async function changeProjectMemberRoles({
    users
}) {
    try {
        if (!Array.isArray(users)) {
            throw new Error(
                "users must be an array."
            );
        }

        const validRoles = [
            "manager",
            "member"
        ];

        const results = [];

        for (const user of users) {
            if (
                !validRoles.includes(
                    user.role
                )
            ) {
                throw new Error(
                    `Invalid role: ${user.role}`
                );
            }

            const result =
                await prisma.projectMember.update({
                    where: {
                        project_id_user_id: {
                            project_id:
                                user.projectId,
                            user_id:
                                user.userId
                        }
                    },
                    data: {
                        role:
                            user.role
                    }
                });

            results.push({
                projectId:
                    user.projectId,
                userId:
                    user.userId,
                role:
                    result.role
            });
        }

        return {
            count:
                results.length,
            results
        };
    } catch (error) {
        const err = new Error(
            `changeProjectMemberRoles failed: ${error && error.message ? error.message : String(error)}`
        );
        err.originalError = error;
        throw err;
    }
}

export default changeProjectMemberRoles;