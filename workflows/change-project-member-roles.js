import changeProjectMemberRoles from "../tools/database/project/change-project-member-roles.js";

import {
    invalidateProjectMember
} from "../redis/security-cache-service.js";

import {
    invalidateProjectUsers
} from "../redis/project-users-cache-service.js";

/**
 * Change project member roles
 *
 * @param {Object} params
 * @param {Array<{
 *   projectId: string,
 *   userId: string,
 *   role: "manager" | "member"
 * }>} params.users
 * Array of role changes to apply.
 * **/

async function changeProjectMemberRolesWorkflow({
    users
}) {
    try {
        if (!Array.isArray(users)) {
            throw new Error(
                "users must be an array."
            );
        }

        /* -------------------------------------------------------------- */
        /* Step 1: Change member roles                                    */
        /* -------------------------------------------------------------- */

        console.log(
            "[CHANGE PROJECT MEMBER ROLES] Step 1 - Changing member roles"
        );

        let roleChangeResult;

        try {
            roleChangeResult =
                await changeProjectMemberRoles({
                    users
                });

            console.log(
                "[CHANGE PROJECT MEMBER ROLES] Role change result:",
                roleChangeResult
            );
        } catch (error) {
            console.error(
                "[CHANGE PROJECT MEMBER ROLES] Role change failed",
                error
            );

            throw error;
        }

        /* -------------------------------------------------------------- */
        /* Step 2: Invalidate caches                                      */
        /* -------------------------------------------------------------- */

        console.log(
            "[CHANGE PROJECT MEMBER ROLES] Step 2 - Invalidating caches"
        );

        try {
            const projectIds =
                new Set();

            for (
                const user
                of users
            ) {
                await invalidateProjectMember(
                    user.projectId,
                    user.userId
                );

                projectIds.add(
                    user.projectId
                );
            }

            for (
                const projectId
                of projectIds
            ) {
                await invalidateProjectUsers(
                    projectId
                );
            }

            console.log(
                "[CHANGE PROJECT MEMBER ROLES] Cache invalidation complete"
            );
        } catch (error) {
            console.error(
                "[CHANGE PROJECT MEMBER ROLES] Cache invalidation failed",
                error
            );
        }

        return {
            success: true,
            roleChangeResult
        };
    } catch (error) {
        console.error(
            "[CHANGE PROJECT MEMBER ROLES] Workflow failed",
            error
        );

        return {
            success: false,
            error:
                error.message
        };
    }
}

export default changeProjectMemberRolesWorkflow;