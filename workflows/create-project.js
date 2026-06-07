import createProject from "../tools/database/project/create-project.js";

import createUser from "../tools/database/user/create-users.js";

import linkProjectToUsers from "../tools/database/project/link-project-to-users.js";

import linkProjectToThread from "../tools/database/thread/link-project-to-thread.js";

import {
  invalidateProjectMember,
} from "../redis/security-cache-service.js";

import {
  invalidateUserProjects,
} from "../redis/project-cache-service.js";

import {
  invalidateProjectUsers,
} from "../redis/project-users-cache-service.js";

import {
  invalidateThreadProject,
} from "../redis/thread-cache-service.js";

/**
 * Create a project
 *
 * @param {Object} params
 * @param {string} params.userId
 * @param {string} params.projectName
 * @param {string|null} params.threadId
 * @returns {Object}
 */
async function createProjectWorkflow({
  userId,
  projectName,
  threadId,
}) {
  try {

    /* -------------------------------------------------------------- */
    /* Step 1: Create user                                             */
    /* -------------------------------------------------------------- */

    console.log(
      "[CREATE PROJECT] Step 1 - Creating user"
    );

    let userResult;

    try {
      userResult =
        await createUser({
          users: [
            userId,
          ],
        });

      console.log(
        "[CREATE PROJECT] User creation result:",
        userResult
      );
    } catch (error) {
      console.error(
        "[CREATE PROJECT] User creation failed",
        error
      );

      throw error;
    }

    /* -------------------------------------------------------------- */
    /* Step 2: Create project                                          */
    /* -------------------------------------------------------------- */

    console.log(
      "[CREATE PROJECT] Step 2 - Creating project"
    );

    let project;

    try {
      project =
        await createProject({
          projectName,
          creatorSlackId:
            userId,
        });

      console.log(
        "[CREATE PROJECT] Project created:",
        project
      );
    } catch (error) {
      console.error(
        "[CREATE PROJECT] Project creation failed",
        error
      );

      throw error;
    }

    /* -------------------------------------------------------------- */
    /* Step 3: Link project to user                                    */
    /* -------------------------------------------------------------- */

    console.log(
      "[CREATE PROJECT] Step 3 - Linking user to project"
    );

    let projectMemberResult;

    try {
      projectMemberResult =
        await linkProjectToUsers({
          projectId:
            project.id,
          users: [
            {
              userId,
              role:
                "manager",
            },
          ],
        });

      console.log(
        "[CREATE PROJECT] Project member result:",
        projectMemberResult
      );
    } catch (error) {
      console.error(
        "[CREATE PROJECT] Project member linking failed",
        error
      );

      throw error;
    }

    /* -------------------------------------------------------------- */
    /* Step 4: Link project to thread                                  */
    /* -------------------------------------------------------------- */

    let threadResult =
      null;

    if (threadId) {
      console.log(
        "[CREATE PROJECT] Step 4 - Linking project to thread"
      );

      try {
        threadResult =
          await linkProjectToThread({
            projectId:
              project.id,
            threadId,
          });

        console.log(
          "[CREATE PROJECT] Thread link result:",
          threadResult
        );
      } catch (error) {
        console.error(
          "[CREATE PROJECT] Thread linking failed",
          error
        );

        throw error;
      }
    }

    /* -------------------------------------------------------------- */
/* Step 5: Invalidate caches                                       */
/* -------------------------------------------------------------- */

console.log(
  "[CREATE PROJECT] Step 5 - Invalidating caches"
);

try {
  await invalidateProjectMember(
    project.id,
    userId
  );

  await invalidateUserProjects(
    userId
  );

  await invalidateProjectUsers(
    project.id
  );

  if (threadId) {
    await invalidateThreadProject(
      threadId
    );
  }

  console.log(
    "[CREATE PROJECT] Cache invalidation complete"
  );
} catch (error) {
  console.error(
    "[CREATE PROJECT] Cache invalidation failed",
    error
  );

  console.warn(
    "[CREATE PROJECT] Continuing workflow despite cache invalidation failure"
  );
}

    return {
      success: true,

      project: {
        id: project.id,
        name:
          project.name,
        createdBy:
          project.created_by,
        createdAt:
          project.created_at,
      },

      projectMember: {
        projectId:
          project.id,
        userId,
        role:
          "manager",
      },

      thread:
        threadResult
          ? {
              threadId:
                threadResult.thread_id,
              projectId:
                threadResult.project_id,
            }
          : null,
    };
  } catch (error) {
    console.error(
      "[CREATE PROJECT] Workflow failed",
      error
    );

    return {
      success: false,
      error:
        error.message,
    };
  }
}

export default createProjectWorkflow;