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
}

export default linkProjectToThread;