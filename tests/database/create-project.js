// This function is a test for tools/database/create_project.js.
import createProject from "../../tools/database/project/create-project.js";

async function testCreateProject() {
  console.log("Running createProject test...");
  const testProjectData = {
    projectName: "Test Project 2",
    creatorSlackId: "U12345678"
  };    

    try {   
    const newProject = await createProject(testProjectData);
    console.log("Project created successfully:", newProject);
  } catch (error) {
    console.error("Error creating project:", error);
  } finally {
    process.exit();
  } 
}

testCreateProject();

// To run this test, use the command: node tests/database/create-project.js