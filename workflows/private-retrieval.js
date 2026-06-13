import retrieveChunks from "../tools/api-call/retrieve-chunks.js";

/**
 * Retrieve public project context
 *
 * Privacy filtering is always enabled.
 * Only public chunks are returned.
 *
 * @param {Object} params
 * @param {string} params.query
 * @param {string} params.projectId
 * @returns {Object}
 */
async function privateRetrievalWorkflow({
    query,
    projectId,
}) {
    try {
        if (!query) {
            throw new Error(
                "query is required."
            );
        }

        if (!projectId) {
            throw new Error(
                "projectId is required."
            );
        }

        const retrievalResult =
            await retrieveChunks(
                query,
                projectId,
                false
            );

        return retrievalResult;
    } catch (error) {
        console.error(
            "[PUBLIC RETRIEVAL] Workflow failed",
            error
        );

        return {
            success: false,
            error:
                error.message,
        };
    }
}

export default privateRetrievalWorkflow;