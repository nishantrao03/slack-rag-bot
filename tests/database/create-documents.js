// This is a test function for tools/database/create_documents.js.
import createDocuments from "../../tools/database/document/create-documents.js";
async function testCreateDocuments() {
  console.log("Running createDocuments test...");
  const testDocumentsData = [
    {
      name: "Test Document 1",
      link: "https://example.com/test1",
      projectId: "d8d6fa48-add0-4f96-8908-2ad55fd81928",
      slackMemberId: "U12345678"
    },
    {
      name: "Test Document 2",
      link: "https://example.com/test2",
      projectId: "d8d6fa48-add0-4f96-8908-2ad55fd81928",
      slackMemberId: "U12345678"
    }
    // {
    //   name: "Test Document 1",
    //   link: "https://example.com/test1",
    //   projectId: "d8d6fa48-add0-4f96-8908-2ad55fd81928",
    //   slackMemberId: "U12345678"
    // },
    // {
    //   name: "Test Document 1",
    //   link: "https://example.com/test1",
    //   projectId: "d8d6fa48-add0-4f96-8908-2ad55fd81928",
    //   slackMemberId: "U12345678"
    // },
    // {
    //   name: "Test Document 1",
    //   link: "https://example.com/test1",
    //   projectId: "d8d6fa48-add0-4f96-8908-2ad55fd81928",
    //   slackMemberId: "U12345678"
    // }
  ];

  try {
    const createdDocumentIds = await createDocuments(testDocumentsData);
    console.log("Created Documents:", createdDocumentIds);
  } catch (error) {
    console.error("Error occurred while creating documents:", error);
  }
}

testCreateDocuments();
// To run this test, use the command: node tests/database/create-documents.js