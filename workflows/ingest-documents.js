import crypto from "crypto";

import ingestDocuments from "../tools/api-call/ingest-documents.js";

import createDocuments from "../tools/database/document/create-documents.js";

/**
 * Ingest project documents
 *
 * AI Agent Note:
 * Slack files must always use url_private_download.
 *
 * Never use:
 * - url_private
 * - permalink
 * - permalink_public
 *
 * Supported sources:
 * - Slack files
 * - Google Drive files
 *
 * Google Drive document metadata is extracted
 * by the ingestion service.
 *
 * @param {Object} params
 * @param {string} params.projectId
 * @param {string} params.slackMemberId
 * @param {Array<string>} [params.fileUrls=[]]
 * @param {string} [params.textContent]
 * @returns {Object}
 */
async function ingestDocumentsWorkflow({
    projectId,
    slackMemberId,
    textContent,
    fileUrls = [],
}) {
    try {
        if (!projectId) {
            throw new Error(
                "projectId is required."
            );
        }

        if (!slackMemberId) {
            throw new Error(
                "slackMemberId is required."
            );
        }

        if (
    fileUrls !== undefined
    && !Array.isArray(
        fileUrls
    )
) {
    throw new Error(
        "fileUrls must be an array."
    );
}

const hasFiles =
    Array.isArray(
        fileUrls
    )
    && fileUrls.length > 0;

const hasTextContent =
    typeof textContent ===
        "string"
    && textContent.trim()
        .length > 0;

if (
    !hasFiles
    && !hasTextContent
) {
    throw new Error(
        "Either fileUrls or textContent is required."
    );
}

        const documentMetadataMap =
            new Map();

        const filesMetadata =
            fileUrls.map(
                (fileUrl) => {
                    const documentId =
                        crypto.randomUUID();

                    const isSlackFile =
                        fileUrl.includes(
                            "files.slack.com"
                        );

                    let documentName =
                        null;

                    let documentType =
                        null;

                    if (
                        isSlackFile
                    ) {
                        const fileName =
                            fileUrl
                                .split("/")
                                .pop();

                        documentName =
                            decodeURIComponent(
                                fileName
                            );

                        documentType =
                            documentName
                                .split(
                                    "."
                                )
                                .pop()
                                .toLowerCase();
                    }

                    documentMetadataMap.set(
                        documentId,
                        {
                            documentId,
                            link: fileUrl,
                        }
                    );

                    return {
                        download_url:
                            fileUrl,

                        source:
                            isSlackFile
                                ? "slack"
                                : "google_drive",

                        project_id:
                            projectId,

                        document_id:
                            documentId,

                        document_type:
                            documentType,

                        document_name:
                            documentName,

                        text_content:
                            null
                    };
                }
            );

        if (textContent) {
    const documentId =
        crypto.randomUUID();

    filesMetadata.push({
        download_url:
            null,

        source:
            "text",

        project_id:
            projectId,

        document_id:
            documentId,

        document_type:
            null,

        document_name:
            `Project_Context_${documentId}`,

        text_content:
            textContent,
    });

    documentMetadataMap.set(
        documentId,
        {
            documentId,
            link: null,
        }
    );
}

        let pendingFiles =
            filesMetadata;

        const successfulDocuments =
            [];

        for (
            let attempt = 1;
            attempt <= 3;
            attempt++
        ) {
            if (
                pendingFiles.length ===
                0
            ) {
                break;
            }

            const ingestionResults =
                await ingestDocuments(
                    pendingFiles
                );

            const failedDocumentIds =
                new Set();

            for (const result of ingestionResults) {
                if (
                    result.ingestion_success ===
                    1
                ) {
                    successfulDocuments.push(
                        result
                    );

                    continue;
                }

                failedDocumentIds.add(
                    result.document_id
                );
            }

            pendingFiles =
                pendingFiles.filter(
                    (
                        fileMetadata
                    ) =>
                        failedDocumentIds.has(
                            fileMetadata.document_id
                        )
                );
        }

        const documentsToCreate =
            successfulDocuments.map(
                (document) => ({
                    documentId:
                        document.document_id,

                    name:
                        document.document_name,

                    link:
                        documentMetadataMap.get(
                            document.document_id
                        ).link,

                    projectId,

                    slackMemberId,
                })
            );

        let databaseDocumentIds =
            [];

        if (
            documentsToCreate.length >
            0
        ) {
            databaseDocumentIds =
                await createDocuments(
                    documentsToCreate
                );
        }

        const finalFailedDocuments =
            pendingFiles.map(
                (
                    fileMetadata
                ) => ({
                    document_id:
                        fileMetadata.document_id,

                    document_name:
                        fileMetadata.document_name,

                    document_type:
                        fileMetadata.document_type,
                })
            );

        return {
            success: true,

            summary: {
                totalDocuments:
                    filesMetadata.length,

                ingestedDocuments:
                    successfulDocuments.length,

                failedDocuments:
                    finalFailedDocuments.length,
            },

            ingestedDocuments:
                successfulDocuments,

            failedDocuments:
                finalFailedDocuments,

            databaseDocumentIds,
        };
    } catch (error) {
        console.error(
            "[INGEST DOCUMENTS] Workflow failed",
            error
        );

        return {
            success: false,
            error:
                error.message,
        };
    }
}

export default ingestDocumentsWorkflow;