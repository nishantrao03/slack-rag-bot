import prisma from "../../../services/db/prisma-client.js";

async function fetchDocumentsForProject(
    projectId
) {
    if (!projectId) {
        throw new Error(
            "projectId is required."
        );
    }
    try {
        return await prisma.document.findMany({
            where: {
                project_id: projectId,
            },
        });
    } catch (error) {
        const err = new Error(
            `fetchDocumentsForProject failed: ${error && error.message ? error.message : String(error)}`
        );
        err.originalError = error;
        throw err;
    }
}

export default fetchDocumentsForProject;