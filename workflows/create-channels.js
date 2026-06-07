import createChannels from "../tools/slack/create-channels.js";

import linkProjectToChannels from "../tools/database/channel/link-project-to-channels.js";

//import createChannels from "../tools/slack/create-channels.js";

import addMembersToChannel from "../tools/slack/add-members-to-channel.js";

import {
    invalidateChannelProject,
} from "../redis/channel-cache-service.js";

/**
 * Create channels for a project
 *
 * @param {Object} params
 * @param {string} params.projectId
 * @param {Array<{name: string, isPrivate: boolean}>} params.channels
 * @returns {Object}
 */
async function createChannelsWorkflow({
    projectId,
    userId,
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
            ) ||
            channels.length === 0
        ) {
            throw new Error(
                "channels must be a non-empty array."
            );
        }

        /* -------------------------------------------------------------- */
        /* Step 1: Create channels in Slack                               */
        /* -------------------------------------------------------------- */

        console.log(
            "[CREATE CHANNELS] Step 1 - Creating channels in Slack"
        );

        let slackChannels;

        try {
            slackChannels =
                await createChannels({
                    channels,
                });

            console.log(
                "[CREATE CHANNELS] Slack channels created:",
                slackChannels
            );
        } catch (error) {
            console.error(
                "[CREATE CHANNELS] Slack channel creation failed",
                error
            );

            throw error;
        }

        /* -------------------------------------------------------------- */
        /* Step 2: Build DB payload                                       */
        /* -------------------------------------------------------------- */

        console.log(
            "[CREATE CHANNELS] Step 2 - Building DB payload"
        );

        let dbChannels;

        try {
            dbChannels =
                slackChannels.map(
                    (
                        response
                    ) => ({
                        channelId:
                            response.channel.id,
                        name:
                            response.channel.name,
                        isPrivate:
                            response.channel.is_private,
                    })
                );

            console.log(
                "[CREATE CHANNELS] DB payload created:",
                dbChannels
            );
        } catch (error) {
            console.error(
                "[CREATE CHANNELS] Failed to build DB payload",
                error
            );

            throw error;
        }

        /* -------------------------------------------------------------- */
        /* Step 3: Link channels to project                               */
        /* -------------------------------------------------------------- */

        console.log(
            "[CREATE CHANNELS] Step 3 - Linking channels to project"
        );

        let channelResult;

        try {
            channelResult =
                await linkProjectToChannels({
                    projectId,
                    channels:
                        dbChannels,
                });

            console.log(
                "[CREATE CHANNELS] Channels linked to project:",
                channelResult
            );
        } catch (error) {
            console.error(
                "[CREATE CHANNELS] Project channel linking failed",
                error
            );

            throw error;
        }

        /* -------------------------------------------------------------- */
        /* Step 4: Add creator to channels                                */
        /* -------------------------------------------------------------- */

console.log(
    "[CREATE CHANNELS] Step 4 - Adding creator to channels"
);

try {
    for (
        const channel
        of dbChannels
    ) {
        await addMembersToChannel({
            channel:
                channel.channelId,
            userIds: [
                userId,
            ],
        });
    }

    console.log(
        "[CREATE CHANNELS] Creator added to channels"
    );
} catch (error) {
    console.error(
        "[CREATE CHANNELS] Failed to add creator to channels",
        error
    );

    throw error;
}

        /* -------------------------------------------------------------- */
        /* Step 5: Invalidate caches                                      */
        /* -------------------------------------------------------------- */

        console.log(
            "[CREATE CHANNELS] Step 4 - Invalidating caches"
        );

        try {
            for (
                const channel
                of dbChannels
            ) {
                await invalidateChannelProject(
                    channel.channelId
                );
            }

            console.log(
                "[CREATE CHANNELS] Cache invalidation complete"
            );
        } catch (error) {
            console.error(
                "[CREATE CHANNELS] Cache invalidation failed",
                error
            );
        }

        return {
            success: true,

            projectId,

            channels:
                dbChannels,
        };
    } catch (error) {
        console.error(
            "[CREATE CHANNELS] Workflow failed",
            error
        );

        return {
            success: false,
            error:
                error.message,
        };
    }
}

export default createChannelsWorkflow;