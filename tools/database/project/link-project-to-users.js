import prisma from "../../../services/db/prisma-client.js";

/**
 * Link users to a project
 *
 * @param {Object} params
 * @param {string} params.projectId
 * @param {Array<{userId: string, role: string}>} params.users
 * @returns {Object}
 */
async function linkProjectToUsers({
  projectId,
  users,
}) {
  try {
    if (!projectId) {
      throw new Error(
        "projectId is required."
      );
    }

    if (!Array.isArray(users)) {
      throw new Error(
        "users must be an array."
      );
    }

    const data = users.map(
      ({ userId, role }) => ({
        project_id: projectId,
        user_id: userId,
        role,
      })
    );

    return await prisma.projectMember.createMany({
      data,
      skipDuplicates: true,
    });
  } catch (error) {
    const err = new Error(
      `linkProjectToUsers failed: ${error && error.message ? error.message : String(error)}`
    );
    err.originalError = error;
    throw err;
  }
}

export default linkProjectToUsers;