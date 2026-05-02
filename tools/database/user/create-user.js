import prisma from "../../../services/db/prisma-client.js";

async function createUser({ slackMemberId, email, name }) {
  const user = await prisma.user.create({
    data: {
      slack_member_id: slackMemberId,
      email: email,
      name: name,
    },
  });

  return user;
}

export default createUser;