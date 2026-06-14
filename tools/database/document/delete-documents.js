// tools/database/document/delete-documents.js

import prisma from "../../../services/db/prisma-client.js";

/**
 * Deletes multiple documents from the database by their IDs.
 *
 * @param {Array<string>} documentIds - Array of document IDs to delete.
 * @returns {Promise<Array<string>>} - Returns the array of deleted document IDs.
 */
async function deleteDocuments(documentIds) {
  if (!Array.isArray(documentIds) || documentIds.length === 0) {
    return [];
  }
  try {
    await prisma.document.deleteMany({
      where: {
        document_id: {
          in: documentIds,
        },
      },
    });

    return documentIds;
  } catch (error) {
    const err = new Error(
      `deleteDocuments failed: ${error && error.message ? error.message : String(error)}`
    );
    err.originalError = error;
    throw err;
  }
}

export default deleteDocuments;