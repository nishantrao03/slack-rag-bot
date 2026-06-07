// This is a test for tools/database/project/link-project-to-users.js. No creation of project.

// Here is the original function

// import prisma from "../../../services/db/prisma-client.js";

// /**
//  * Link users to a project
//  *
//  * @param {Object} params
//  * @param {string} params.projectId
//  * @param {Array<{userId: string, role: string}>} params.users
//  * @returns {Object}
//  */
// async function linkProjectToUsers({
//   projectId,
//   users,
// }) {
//   if (!projectId) {
//     throw new Error(
//       "projectId is required."
//     );
//   }

//   if (!Array.isArray(users)) {
//     throw new Error(
//       "users must be an array."
//     );
//   }

//   const data = users.map(
//     ({ userId, role }) => ({
//       project_id: projectId,
//       user_id: userId,
//       role,
//     })
//   );

//   return await prisma.projectMember.createMany({
//     data,
//     skipDuplicates: true,
//   });
// }

// export default linkProjectToUsers;

// Now the test please

import linkProjectToUsers from "../../tools/database/project/link-project-to-users.js";

async function testLinkProjectToUsers() {
  console.log("Running linkProjectToUsers test...");
    const projectId = "08cafc23-9bab-4b0e-98c4-9c95ca1dd9e3"; // Replace with an actual project ID from your DB
    const usersToLink = [
        { userId: "U12345678", role: "manager" }, // Replace with actual user IDs from your DB
        { userId: "U87654321", role: "member" }
    ];

    try {
        const result = await linkProjectToUsers({ projectId, users: usersToLink });
        console.log("linkProjectToUsers Result:", result);
    } catch (error) {
        console.error("Error in linkProjectToUsers test:", error);
    }

}

testLinkProjectToUsers();
// To run this test, use the command: node tests/database/link-project-to-users.js