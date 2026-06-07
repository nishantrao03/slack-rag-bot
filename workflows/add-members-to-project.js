import createUsers from "../tools/database/user/create-users.js";
import linkProjectToUsers from "../tools/database/project/link-project-to-users.js";

import {
    invalidateProjectMember
} from "../redis/security-cache-service.js";

import {
    invalidateUserProjects
} from "../redis/project-cache-service.js";

import {
    invalidateProjectUsers
} from "../redis/project-users-cache-service.js";

/**
 * Add users to a project
 *
 * @param {Object} params
 * @param {string} params.projectId
 * @param {Array<{userId: string, role: string}>} params.users
 * @returns {Object}
 */
async function addMembersToProject({
    projectId,
    users
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

        /* -------------------------------------------------------------- */
        /* Step 1: Create users                                            */
        /* -------------------------------------------------------------- */

        console.log(
            "[ADD MEMBERS TO PROJECT] Step 1 - Creating users"
        );

        let userResult;

        try {
            userResult =
                await createUsers({
                    users: users.map(
                        ({ userId }) => userId
                    )
                });

            console.log(
                "[ADD MEMBERS TO PROJECT] User creation result:",
                userResult
            );
        } catch (error) {
            console.error(
                "[ADD MEMBERS TO PROJECT] User creation failed",
                error
            );

            throw error;
        }

        /* -------------------------------------------------------------- */
        /* Step 2: Link users to project                                   */
        /* -------------------------------------------------------------- */

        console.log(
            "[ADD MEMBERS TO PROJECT] Step 2 - Linking users to project"
        );

        let projectMemberResult;

        try {
            projectMemberResult =
                await linkProjectToUsers({
                    projectId,
                    users
                });

            console.log(
                "[ADD MEMBERS TO PROJECT] Project member result:",
                projectMemberResult
            );
        } catch (error) {
            console.error(
                "[ADD MEMBERS TO PROJECT] Project member linking failed",
                error
            );

            throw error;
        }

        /* -------------------------------------------------------------- */
        /* Step 3: Invalidate caches                                       */
        /* -------------------------------------------------------------- */

        console.log(
    "[ADD MEMBERS TO PROJECT] Step 3 - Invalidating caches"
);

try {
    for (const user of users) {
        await invalidateProjectMember(
            projectId,
            user.userId
        );

        await invalidateUserProjects(
            user.userId
        );
    }

    await invalidateProjectUsers(
        projectId
    );

    console.log(
        "[ADD MEMBERS TO PROJECT] Cache invalidation complete"
    );
} catch (error) {
    console.error(
        "[ADD MEMBERS TO PROJECT] Cache invalidation failed",
        error
    );
}

        return {
            success: true,
            projectMemberResult
        };
    } catch (error) {
        console.error(
            "[ADD MEMBERS TO PROJECT] Workflow failed",
            error
        );

        return {
            success: false,
            error: error.message
        };
    }
}

export default addMembersToProject;