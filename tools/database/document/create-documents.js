import prisma from "../../../services/db/prisma-client.js";

async function createDocuments(documents) {
  const documentsToCreate = documents.map((document) => ({
    document_id: document.documentId,
    name: document.name,
    link: document.link,
    project_id: document.projectId,
    uploaded_by: document.slackMemberId,
  }));

  await prisma.document.createMany({
    data: documentsToCreate,
  });

  return documentsToCreate.map(
    (document) => document.document_id
  );
}

export default createDocuments;