import prisma from "../../../services/db/prisma-client.js";

async function fetchDocuments(documentIds) {
    try {
        const documents = await prisma.document.findMany({
            where: {
                document_id: {
                    in: documentIds,
                },
            },
        });
        return documents;
    } catch (error) {
        const err = new Error(
            `fetchDocuments failed: ${error && error.message ? error.message : String(error)}`
        );
        err.originalError = error;
        throw err;
    }
}

export default fetchDocuments;