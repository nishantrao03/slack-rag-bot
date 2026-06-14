import prisma from "../../../services/db/prisma-client.js";

async function fetchUser({ slackMemberId }) {
  try {
    const user = await prisma.user.findUnique({
      where: {
        slack_member_id: slackMemberId,
      },
    });

    return user;
  } catch (error) {
    const err = new Error(
      `fetchUser failed: ${error && error.message ? error.message : String(error)}`
    );
    err.originalError = error;
    throw err;
  }
}

export default fetchUser;