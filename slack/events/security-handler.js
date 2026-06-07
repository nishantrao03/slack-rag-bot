import {
  getProjectMember,
} from "../../redis/security-cache-service.js";

import {
  getChannelProject,
} from "../../redis/channel-cache-service.js";

import {
  getThreadProject,
} from "../../redis/thread-cache-service.js";

/**
 * Resolve security context for an incoming Slack event.
 *
 * @param {Object} params
 * @param {string} params.userId
 * @param {string} params.channelId
 * @param {string|null} params.threadId
 * @returns {Object}
 */
async function securityHandler({
  userId,
  channelId,
  threadId,
}) {
  try {
    /* -------------------------------------------------------------- */
    /* Step 1: Validate inputs                                        */
    /* -------------------------------------------------------------- */

    console.log(
      "[SECURITY] Step 1 - Validating inputs"
    );

    if (!userId) {
      throw new Error(
        "userId is required."
      );
    }

    if (!channelId) {
      throw new Error(
        "channelId is required."
      );
    }

    console.log(
      "[SECURITY] Step 1 Complete"
    );

    /* -------------------------------------------------------------- */
    /* Step 2: Determine channel type                                 */
    /* -------------------------------------------------------------- */

    console.log(
      "[SECURITY] Step 2 - Determining channel type"
    );

    const channelType =
      channelId.charAt(0);

    console.log(
      "[SECURITY] Channel Type:",
      channelType
    );

    /* -------------------------------------------------------------- */
    /* Step 3: Handle project channels                                */
    /* -------------------------------------------------------------- */

    if (channelType === "C") {
      console.log(
        "[SECURITY] Step 3 - Resolving project from channel"
      );

      let projectId;

      try {
        projectId =
          await getChannelProject(
            channelId
          );

        console.log(
          "[SECURITY] Project ID:",
          projectId
        );
      } catch (error) {
        console.error(
          "[SECURITY] Failed to resolve project from channel",
          error
        );

        throw error;
      }

      let member;

      try {
        member =
          await getProjectMember(
            projectId,
            userId
          );

        console.log(
          "[SECURITY] Member Result:",
          member
        );
      } catch (error) {
        console.error(
          "[SECURITY] Failed to resolve project membership",
          error
        );

        throw error;
      }

      return {
        authorized: 1,
        projectId,
        member,
      };
    }

    /* -------------------------------------------------------------- */
    /* Step 4: Handle DM and group conversations                      */
    /* -------------------------------------------------------------- */

    if (
      channelType === "D" ||
      channelType === "G"
    ) {
      console.log(
        "[SECURITY] Step 4 - Handling DM or group conversation"
      );

      /* ------------------------------------------------------------ */
      /* Step 5: Check thread existence                               */
      /* ------------------------------------------------------------ */

      if (!threadId) {
        console.log(
          "[SECURITY] No thread ID found"
        );

        return {
          authorized: 0,
          projectId: null,
          member: null,
        };
      }

      console.log(
        "[SECURITY] Step 5 Complete"
      );

      /* ------------------------------------------------------------ */
      /* Step 6: Resolve project from thread                          */
      /* ------------------------------------------------------------ */

      let projectId;

      try {
        projectId =
          await getThreadProject(
            threadId
          );

        console.log(
          "[SECURITY] Thread Project ID:",
          projectId
        );
      } catch (error) {
        console.error(
          "[SECURITY] Failed to resolve project from thread",
          error
        );

        throw error;
      }

      if (!projectId) {
        console.log(
          "[SECURITY] No project associated with thread"
        );

        return {
          authorized: 0,
          projectId: null,
          member: null,
        };
      }

      /* ------------------------------------------------------------ */
      /* Step 7: Resolve project membership                           */
      /* ------------------------------------------------------------ */

      let member;

      try {
        member =
          await getProjectMember(
            projectId,
            userId
          );

        console.log(
          "[SECURITY] Member Result:",
          member
        );
      } catch (error) {
        console.error(
          "[SECURITY] Failed to resolve project membership",
          error
        );

        throw error;
      }

      return {
        authorized: 1,
        projectId,
        member,
      };
    }

    /* -------------------------------------------------------------- */
    /* Step 8: Unsupported channel type                               */
    /* -------------------------------------------------------------- */

    throw new Error(
      `Unsupported channel type: ${channelType}`
    );
  } catch (error) {
    console.error(
      "[SECURITY] Handler Failed",
      error
    );

    throw error;
  }
}

export default securityHandler;