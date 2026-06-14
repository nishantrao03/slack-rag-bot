import prisma from "../../../services/db/prisma-client.js";

/**
 * Create users if they do not already exist
 *
 * @param {Object} params
 * @param {Array<string>} params.users
 * @returns {Object}
 */
async function createUsers({ users }) {
    try {
        if (!Array.isArray(users)) {
            throw new Error(
                "users must be an array."
            );
        }

        return await prisma.user.createMany({
            data: users.map(
                (slackMemberId) => ({
                    slack_member_id:
                        slackMemberId
                })
            ),
            skipDuplicates: true
        });
    } catch (error) {
        const err = new Error(
            `createUsers failed: ${error && error.message ? error.message : String(error)}`
        );
        err.originalError = error;
        throw err;
    }
}

export default createUsers;