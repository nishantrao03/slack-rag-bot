import prisma from "../../../services/db/prisma-client.js";

/**
 * Update project names
 *
 * @param {Object} params
 * @param {Array<Object>} params.projects
 * @returns {Object}
 */
async function updateProjectNames({
    projects
}) {
    if (!Array.isArray(projects)) {
        throw new Error(
            "projects must be an array."
        );
    }

    const results = [];

    for (const project of projects) {
        const updatedProject =
            await prisma.project.update({
                where: {
                    id:
                        project.projectId
                },
                data: {
                    name:
                        project.projectName
                }
            });

        results.push({
            projectId:
                updatedProject.id,
            projectName:
                updatedProject.name
        });
    }

    return {
        count:
            results.length,
        results
    };
}

export default updateProjectNames;