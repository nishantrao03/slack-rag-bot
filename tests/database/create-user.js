// This is a test for tools/database/create_user.js.
import createUser from "../../tools/database/user/create-user.js";

async function testCreateUser() {
  console.log("Running createUser test...");
    const testUserData = {
    slackMemberId: "U12345678",
    email: "test@example.com",
    name: "Test User",
  };

    try {
    const newUser = await createUser(testUserData);
    console.log("User created successfully:", newUser);
  } catch (error) {
    console.error("Error creating user:", error);
  } finally {
    process.exit();
  }             
}

testCreateUser();