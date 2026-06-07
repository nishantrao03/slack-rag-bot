import removeUsersFromProject from "../tools/database/project/remove-users-from-project.js";

import fetchChannelsForProject from "../tools/database/project/fetch-channels-for-project.js";

import removeMembersFromChannels from "./remove-members-from-channels.js";

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
 * Remove members from a project
 *
 * @param {Object} params
 * @param {string} params.projectId
 * @param {Array<string>} params.userIds
 * @returns {Object}
 */
async function removeMembersFromProject({
    projectId,
    userIds,
}) {
    try {
        if (!projectId) {
            throw new Error(
                "projectId is required."
            );
        }

        if (
            !Array.isArray(
                userIds
            )
        ) {
            throw new Error(
                "userIds must be an array."
            );
        }

        /* -------------------------------------------------------------- */
        /* Step 1: Remove users from project                              */
        /* -------------------------------------------------------------- */

        console.log(
            "[REMOVE MEMBERS FROM PROJECT] Step 1 - Removing users from project"
        );

        let removeUsersResult;

        try {
            removeUsersResult =
                await removeUsersFromProject({
                    projectId,
                    userIds,
                });

            console.log(
                "[REMOVE MEMBERS FROM PROJECT] Remove users result:",
                removeUsersResult
            );
        } catch (error) {
            console.error(
                "[REMOVE MEMBERS FROM PROJECT] User removal failed",
                error
            );

            throw error;
        }

        /* -------------------------------------------------------------- */
        /* Step 2: Fetch project channels                                 */
        /* -------------------------------------------------------------- */

        console.log(
            "[REMOVE MEMBERS FROM PROJECT] Step 2 - Fetching project channels"
        );

        let projectChannels;

        try {
            projectChannels =
                await fetchChannelsForProject({
                    projectId,
                });

            console.log(
                "[REMOVE MEMBERS FROM PROJECT] Project channels:",
                projectChannels
            );
        } catch (error) {
            console.error(
                "[REMOVE MEMBERS FROM PROJECT] Channel fetch failed",
                error
            );

            throw error;
        }

        /* -------------------------------------------------------------- */
        /* Step 3: Build channel removal input                            */
        /* -------------------------------------------------------------- */

        console.log(
            "[REMOVE MEMBERS FROM PROJECT] Step 3 - Building channel removal input"
        );

        const removeMembersInput = {
            projectId,

            channels:
                projectChannels.map(
                    ({
                        channelId,
                    }) => ({
                        channelId,
                        userIds,
                    })
                ),
        };

        console.log(
            "[REMOVE MEMBERS FROM PROJECT] Channel removal input:",
            removeMembersInput
        );

        /* -------------------------------------------------------------- */
        /* Step 4: Remove users from channels                             */
        /* -------------------------------------------------------------- */

        console.log(
            "[REMOVE MEMBERS FROM PROJECT] Step 4 - Removing users from channels"
        );

        let channelRemovalResult;

        try {
            channelRemovalResult =
                await removeMembersFromChannels(
                    removeMembersInput
                );

            console.log(
                "[REMOVE MEMBERS FROM PROJECT] Channel removal result:",
                channelRemovalResult
            );
        } catch (error) {
            console.error(
                "[REMOVE MEMBERS FROM PROJECT] Channel member removal failed",
                error
            );

            throw error;
        }

        /* -------------------------------------------------------------- */
        /* Step 5: Invalidate caches                                      */
        /* -------------------------------------------------------------- */

        console.log(
            "[REMOVE MEMBERS FROM PROJECT] Step 5 - Invalidating caches"
        );

        try {
            for (
                const userId
                of userIds
            ) {
                await invalidateProjectMember(
                    projectId,
                    userId
                );

                await invalidateUserProjects(
                    userId
                );
            }

            await invalidateProjectUsers(
                projectId
            );

            console.log(
                "[REMOVE MEMBERS FROM PROJECT] Cache invalidation complete"
            );
        } catch (error) {
            console.error(
                "[REMOVE MEMBERS FROM PROJECT] Cache invalidation failed",
                error
            );
        }

        return {
            success: true,

            projectId,

            usersRemoved:
                userIds,

            channelsProcessed:
                projectChannels.map(
                    ({
                        channelId,
                    }) =>
                        channelId
                ),

            removeUsersResult,

            channelRemovalResult,
        };
    } catch (error) {
        console.error(
            "[REMOVE MEMBERS FROM PROJECT] Workflow failed",
            error
        );

        return {
            success: false,
            error:
                error.message,
        };
    }
}

export default removeMembersFromProject;