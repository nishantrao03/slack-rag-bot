import prisma from "../../../services/db/prisma-client.js";

async function createDocuments(documents) {
  try {
    const documentsToCreate = documents.map((document) => ({
      document_id: document.documentId,
      name: document.name,
      link: document.link,
      project_id: document.projectId,
      uploaded_by: document.slackMemberId,
      is_private: document.isPrivate,
    }));

    await prisma.document.createMany({
      data: documentsToCreate,
    });

    return documentsToCreate.map((document) => document.document_id);
  } catch (error) {
    const err = new Error(
      `createDocuments failed: ${error && error.message ? error.message : String(error)}`
    );
    err.originalError = error;
    throw err;
  }
}

export default createDocuments;