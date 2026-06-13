import fetchDocumentsForProject from "../tools/database/document/fetch-documents-for-project.js";

import deleteDocuments from "../tools/database/document/delete-documents.js";

import deleteContextEndpoint from "../tools/api-call/context-deletion.js";

/**
 * Delete project documents and associated context
 *
 * AI Agent Notes:
 * - Only pass document IDs that should be removed.
 * - The workflow automatically validates that the documents belong
 *   to the specified project.
 * - Invalid or unrelated document IDs are ignored.
 * - Context is deleted before database records.
 * - If context deletion fails, database deletion is not attempted.
 * - Use document IDs returned by project document retrieval tools.
 *
 * @param {Object} params
 * @param {string} params.projectId
 * @param {Array<string>} params.documentIds
 * @returns {Object}
 */
async function deleteContextWorkflow({
    projectId,
    documentIds,
}) {
    try {
        if (!projectId) {
            throw new Error(
                "projectId is required."
            );
        }

        if (
            !Array.isArray(
                documentIds
            )
        ) {
            throw new Error(
                "documentIds must be an array."
            );
        }

        if (
            documentIds.length ===
            0
        ) {
            throw new Error(
                "documentIds cannot be empty."
            );
        }

        const projectDocuments =
            await fetchDocumentsForProject(
                projectId
            );

        const projectDocumentIdSet =
            new Set(
                projectDocuments.map(
                    (document) =>
                        document.document_id
                )
            );

        const validDocumentIds =
            documentIds.filter(
                (documentId) =>
                    projectDocumentIdSet.has(
                        documentId
                    )
            );

        const ignoredDocumentIds =
            documentIds.filter(
                (documentId) =>
                    !projectDocumentIdSet.has(
                        documentId
                    )
            );

        if (
            validDocumentIds.length ===
            0
        ) {
            return {
                success: true,

                summary: {
                    requestedDocuments:
                        documentIds.length,

                    validDocuments:
                        0,

                    deletedDocuments:
                        0,

                    ignoredDocuments:
                        ignoredDocumentIds.length,
                },

                deletedDocumentIds:
                    [],

                ignoredDocumentIds,
            };
        }

        const deleteOperation = {
    project_id:
        projectId,

    metadata_filter: {
        layer:
            "base_layer",

        document_id: {
            "$in":
                validDocumentIds
        }
    }
};

await deleteContextEndpoint(
    deleteOperation
);

        const deletedDocumentIds =
            await deleteDocuments(
                validDocumentIds
            );

        return {
            success: true,

            summary: {
                requestedDocuments:
                    documentIds.length,

                validDocuments:
                    validDocumentIds.length,

                deletedDocuments:
                    deletedDocumentIds.length,

                ignoredDocuments:
                    ignoredDocumentIds.length,
            },

            deletedDocumentIds,

            ignoredDocumentIds,
        };
    } catch (error) {
        console.error(
            "[DELETE CONTEXT] Workflow failed",
            error
        );

        return {
            success: false,
            error:
                error.message,
        };
    }
}

export default deleteContextWorkflow;