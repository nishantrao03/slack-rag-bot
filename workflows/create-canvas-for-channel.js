import validateProjectChannels from "../tools/database/channel/validate-project-channels.js";

import createChannelCanvas from "../tools/slack/create-channel-canvas.js";

import createCanvasForChannel from "../tools/database/channel/create-canvas-for-channel.js";

/**
 * Create a canvas for a channel
 *
 * AI Agent Note:
 * content must contain the complete canvas content.
 *
 * The content should already include:
 * - All generated text
 * - All documentation sections
 * - All references
 * - All resource links
 *
 * The workflow will not modify the content.
 * The content should be ready to publish directly
 * to the canvas.
 *
 * AI Agent Note:
 * Any links included in the canvas content
 * should be accessible to the intended
 * project members.
 *
 * Avoid including links that are restricted
 * to a single user or private conversation.
 *
 * @param {Object} params
 * @param {string} params.projectId
 * @param {string} params.channelId
 * @param {string} params.content
 * @returns {Object}
 */
async function createCanvasForChannelWorkflow({
    projectId,
    channelId,
    content,
}) {
    try {
        if (!projectId) {
            throw new Error(
                "projectId is required."
            );
        }

        if (!channelId) {
            throw new Error(
                "channelId is required."
            );
        }

        if (!content) {
            throw new Error(
                "content is required."
            );
        }

        /* -------------------------------------------------------------- */
        /* Step 0: Validate channel                                       */
        /* -------------------------------------------------------------- */

        console.log(
            "[CREATE CANVAS] Step 0 - Validating channel"
        );

        try {
            const validationResult =
                await validateProjectChannels({
                    projectId,
                    channelIds: [
                        channelId,
                    ],
                });

            if (
                validationResult
                    .validChannelIds
                    .length === 0
            ) {
                throw new Error(
                    "Channel does not belong to project."
                );
            }

            console.log(
                "[CREATE CANVAS] Channel validation successful"
            );
        } catch (error) {
            console.error(
                "[CREATE CANVAS] Channel validation failed",
                error
            );

            throw error;
        }

        /* -------------------------------------------------------------- */
        /* Step 1: Create channel canvas                                  */
        /* -------------------------------------------------------------- */

        console.log(
            "[CREATE CANVAS] Step 1 - Creating channel canvas"
        );

        let canvasResult;

        try {
            canvasResult =
                await createChannelCanvas({
                    channelId,
                    content,
                });

            console.log(
                "[CREATE CANVAS] Canvas created:",
                canvasResult
            );
        } catch (error) {
            console.error(
                "[CREATE CANVAS] Canvas creation failed",
                error
            );

            throw error;
        }

        const canvasId =
            canvasResult.canvas_id ??
            canvasResult.canvas?.id ??
            canvasResult.id;

        if (!canvasId) {
            throw new Error(
                "Canvas ID not found in Slack response."
            );
        }

        /* -------------------------------------------------------------- */
        /* Step 2: Store canvas in database                               */
        /* -------------------------------------------------------------- */

        console.log(
            "[CREATE CANVAS] Step 2 - Storing canvas in database"
        );

        let databaseResult;

        try {
            databaseResult =
                await createCanvasForChannel({
                    channelCanvasPairs: [
                        {
                            channelId,
                            canvasId,
                        },
                    ],
                });

            console.log(
                "[CREATE CANVAS] Database update result:",
                databaseResult
            );
        } catch (error) {
            console.error(
                "[CREATE CANVAS] Database update failed",
                error
            );

            throw error;
        }

        return {
            success: true,

            channel: {
                channelId,
                projectId,
            },

            canvas: {
                canvasId,
            },

            databaseResult,
        };
    } catch (error) {
        console.error(
            "[CREATE CANVAS] Workflow failed",
            error
        );

        return {
            success: false,
            error:
                error.message,
        };
    }
}

export default createCanvasForChannelWorkflow;