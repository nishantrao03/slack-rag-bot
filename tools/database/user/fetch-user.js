import prisma from "../../../services/db/prisma-client.js";

async function fetchUser({ slackMemberId }) {
  const user = await prisma.user.findUnique({
    where: {
      slack_member_id: slackMemberId,
    },
  });

  return user;
}

export default fetchUser;