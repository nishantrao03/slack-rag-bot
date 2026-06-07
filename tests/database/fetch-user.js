// This function is a test for tools/database/user/fetch-user.js.
import fetchUser from "../../tools/database/user/fetch-user.js";

async function testFetchUser() {
  console.log("Running fetchUser test...");
  const testSlackMemberId = "U12345678"; // Replace with an actual Slack member ID for testing  
  try {
    const user = await fetchUser({ slackMemberId: testSlackMemberId });
    console.log("User fetched successfully:", user);
  } catch (error) {
    console.error("Error fetching user:", error);
  } finally {
    process.exit();
  }
}

testFetchUser();