import prisma from "../../../services/db/prisma-client.js";

async function fetchDocuments(documentIds) {
    const documents = await prisma.document.findMany({
        where: {
            document_id: {
                in: documentIds,
            },
        },
    });
    return documents;
}

export default fetchDocuments;