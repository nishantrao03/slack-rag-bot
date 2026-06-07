// Before executing this workflow:

// 1. Ensure the target channels already exist.
//    If not, call create-channels.js first.

// 2. Determine whether any users should also be added to the project.
//    Never assume channel membership implies project membership.

// 3. If the user explicitly requests project membership for any users,
//    call add-members-to-project.js first for only those users.

// 4. After the required channels exist and any requested project membership updates are complete,
//    execute add-members-to-channels.js.

import validateProjectChannels from "../tools/database/channel/validate-project-channels.js";

import addMembersToChannel from "../tools/slack/add-members-to-channel.js";

/**
 * Add members to channels
 *
 * @param {Object} params
 * @param {string} params.projectId
 * @param {Array<{channelId: string, userIds: Array<string>}>} params.channels
 * @returns {Object}
 */
async function addMembersToChannels({
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
            "[ADD MEMBERS TO CHANNELS] Step 1 - Validating channels"
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
                "[ADD MEMBERS TO CHANNELS] Validation result:",
                validationResult
            );
        } catch (error) {
            console.error(
                "[ADD MEMBERS TO CHANNELS] Channel validation failed",
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
        /* Step 2: Add members to channels                                */
        /* -------------------------------------------------------------- */

        console.log(
            "[ADD MEMBERS TO CHANNELS] Step 2 - Adding members to channels"
        );

        const channelsUpdated =
            [];

        for (
            const channel
            of validChannels
        ) {
            try {
                await addMembersToChannel({
                    channel:
                        channel.channelId,
                    userIds:
                        channel.userIds,
                });

                channelsUpdated.push({
                    channelId:
                        channel.channelId,
                    usersAdded:
                        channel.userIds,
                });
            } catch (error) {
                console.error(
                    `[ADD MEMBERS TO CHANNELS] Failed for channel ${channel.channelId}`,
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
            "[ADD MEMBERS TO CHANNELS] Workflow failed",
            error
        );

        return {
            success: false,
            error:
                error.message,
        };
    }
}

export default addMembersToChannels;