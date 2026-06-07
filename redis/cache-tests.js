import {
  getProjectMember,
  isProjectMember,
  isProjectManager,
  invalidateProjectMember
} from "./security-cache-service.js";

import {
    connectRedis
} from "./redis-client.js";

await connectRedis();

async function runTests() {
  const projectId = "d8d6fa48-add0-4f96-8908-2ad55fd81928";
  const userId = "U12345678";

  try {
    console.log("\n=== Test 1: getProjectMember ===");

    const member =
      await getProjectMember(
        projectId,
        userId
      );

    console.log(member);

    console.log("\n=== Test 2: isProjectMember ===");

    const isMember =
      await isProjectMember(
        projectId,
        userId
      );

    console.log(isMember);

    console.log("\n=== Test 3: isProjectManager ===");

    const isManager =
      await isProjectManager(
        projectId,
        userId
      );

    console.log(isManager);

    console.log("\n=== Test 4: Cache Invalidation ===");

    await invalidateProjectMember(
      projectId,
      userId
    );

    console.log("Cache invalidated.");

    console.log("\n=== Test 5: Fetch After Invalidation ===");

    const refreshedMember =
      await getProjectMember(
        projectId,
        userId
      );

    console.log(refreshedMember);

    console.log("\n=== Tests Completed ===");
  } catch (error) {
    console.error(error);
  }
}

runTests();

// To run this test, use the command: node redis/cache-tests.js

// Note: Replace "YOUR_PROJECT_ID" and "YOUR_USER_ID" with actual values from your database to test the functionality properly.