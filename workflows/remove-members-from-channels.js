import validateProjectChannels from "../tools/database/channel/validate-project-channels.js";

import removeMembersFromChannel from "../tools/slack/remove-members-from-channel.js";

/**
 * Remove members from channels
 *
 * @param {Object} params
 * @param {string} params.projectId
 * @param {Array<{channelId: string, userIds: Array<string>}>} params.channels
 * @returns {Object}
 */
async function removeMembersFromChannels({
    projectId,
    channels,
}) {
    try {
        if (!projectId) {
            throw new Error(
                "projectId is required."
            );
        }

        if (
            !Array.isArray(
                channels
            )
        ) {
            throw new Error(
                "channels must be an array."
            );
        }

        /* -------------------------------------------------------------- */
        /* Step 1: Validate channels                                      */
        /* -------------------------------------------------------------- */

        console.log(
            "[REMOVE MEMBERS FROM CHANNELS] Step 1 - Validating channels"
        );

        let validationResult;

        try {
            validationResult =
                await validateProjectChannels({
                    projectId,
                    channelIds:
                        channels.map(
                            ({
                                channelId,
                            }) =>
                                channelId
                        ),
                });

            console.log(
                "[REMOVE MEMBERS FROM CHANNELS] Validation result:",
                validationResult
            );
        } catch (error) {
            console.error(
                "[REMOVE MEMBERS FROM CHANNELS] Channel validation failed",
                error
            );

            throw error;
        }

        const validChannelSet =
            new Set(
                validationResult
                    .validChannelIds
            );

        const validChannels =
            channels.filter(
                ({
                    channelId,
                }) =>
                    validChannelSet.has(
                        channelId
                    )
            );

        const skippedChannels =
            channels
                .filter(
                    ({
                        channelId,
                    }) =>
                        !validChannelSet.has(
                            channelId
                        )
                )
                .map(
                    ({
                        channelId,
                    }) => ({
                        channelId,
                        reason:
                            "Channel does not belong to project.",
                    })
                );

        if (
            validChannels.length ===
            0
        ) {
            return {
                success: false,
                error:
                    "No valid channels belong to the project.",
                skippedChannels,
            };
        }

        /* -------------------------------------------------------------- */
        /* Step 2: Remove members from channels                           */
        /* -------------------------------------------------------------- */

        console.log(
            "[REMOVE MEMBERS FROM CHANNELS] Step 2 - Removing members from channels"
        );

        const channelsUpdated =
            [];

        for (
            const channel
            of validChannels
        ) {
            try {
                const result =
                    await removeMembersFromChannel({
                        channel:
                            channel.channelId,
                        userIds:
                            channel.userIds,
                    });

                channelsUpdated.push({
                    channelId:
                        result.channelId,
                    usersRemoved:
                        result.removedUsers,
                });
            } catch (error) {
                console.error(
                    `[REMOVE MEMBERS FROM CHANNELS] Failed for channel ${channel.channelId}`,
                    error
                );

                skippedChannels.push({
                    channelId:
                        channel.channelId,
                    reason:
                        error.message,
                });
            }
        }

        return {
            success: true,

            projectId,

            channelsUpdated,

            skippedChannels,
        };
    } catch (error) {
        console.error(
            "[REMOVE MEMBERS FROM CHANNELS] Workflow failed",
            error
        );

        return {
            success: false,
            error:
                error.message,
        };
    }
}

export default removeMembersFromChannels;