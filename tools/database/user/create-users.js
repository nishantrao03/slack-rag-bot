import prisma from "../../../services/db/prisma-client.js";

/**
 * Create users if they do not already exist
 *
 * @param {Object} params
 * @param {Array<string>} params.users
 * @returns {Object}
 */
async function createUsers({ users }) {
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
}

export default createUsers;