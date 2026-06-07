import boltApp from "../../slack/bolt.js";
import dotenv from "dotenv";

dotenv.config();

/**
 * Find Slack users by email addresses
 *
 * @param {Object} params
 * @param {Array<string>} params.emails
 * @returns {Array<Object>}
 */
async function findUsersByEmail({
  emails,
}) {
  if (
    !Array.isArray(
      emails
    )
  ) {
    throw new Error(
      "emails must be an array."
    );
  }

  const users = [];

  for (
    const email
    of emails
  ) {
    const response =
      await boltApp.client.users.lookupByEmail({
        token:
          process.env.SLACK_BOT_TOKEN,
        email,
      });

    users.push({
      email,
      slackMemberId:
        response.user.id,
    });
  }

  return users;
}

export default findUsersByEmail;