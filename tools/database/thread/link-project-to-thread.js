import prisma from "../../../services/db/prisma-client.js";

/**
 * Link a project to a thread
 *
 * @param {Object} params
 * @param {string} params.projectId
 * @param {string} params.threadId
 * @returns {Object}
 */
async function linkProjectToThread({
  projectId,
  threadId,
}) {
  try {
    if (!projectId) {
      throw new Error(
        "projectId is required."
      );
    }

    if (!threadId) {
      throw new Error(
        "threadId is required."
      );
    }

    return await prisma.thread.create({
      data: {
        thread_id: threadId,
        project_id: projectId,
      },
    });
  } catch (error) {
    const err = new Error(
      `linkProjectToThread failed: ${error && error.message ? error.message : String(error)}`
    );
    err.originalError = error;
    throw err;
  }
}

export default linkProjectToThread;