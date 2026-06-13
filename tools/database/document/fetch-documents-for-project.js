import prisma from "../../../services/db/prisma-client.js";

async function fetchDocumentsForProject(
    projectId
) {
    if (!projectId) {
        throw new Error(
            "projectId is required."
        );
    }

    return await prisma.document.findMany({
        where: {
            project_id:
                projectId,
        },
    });
}

export default fetchDocumentsForProject;