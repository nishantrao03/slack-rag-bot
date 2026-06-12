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
    if (!Array.isArray(users)) {
        throw new Error(
            "users must be an array."
        );
    }

    const results = [];

    for (const user of users) {
        const updatedMember =
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
                    role: user.role
                }
            });

        results.push(updatedMember);
    }

    return {
        count: results.length,
        results
    };
}

export default changeProjectMemberRoles;