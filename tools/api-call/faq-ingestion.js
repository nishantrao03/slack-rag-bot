import dotenv from "dotenv";

dotenv.config();

const CONTEXT_RETRIEVAL_SERVICE_URL =
    process.env.CONTEXT_RETRIEVAL_SERVICE_URL;

async function faqIngestion(
    faq_json,
    project_id
) {
    try {
        if (
            !Array.isArray(
                faq_json
            )
        ) {
            throw new Error(
                "faq_json must be a valid array."
            );
        }

        if (
            !project_id
            || typeof project_id !==
                "string"
        ) {
            throw new Error(
                "project_id must be a valid string."
            );
        }

        const formData =
            new FormData();

        formData.append(
            "project_id",
            project_id
        );

        formData.append(
            "faq_json",
            JSON.stringify(
                faq_json
            )
        );

        const response =
            await fetch(
                `${CONTEXT_RETRIEVAL_SERVICE_URL}/api/faq`,
                {
                    method: "POST",
                    body: formData
                }
            );

        if (!response.ok) {
            const errorResponse =
                await response.text();

            throw new Error(
                `FAQ ingestion failed: ${errorResponse}`
            );
        }

        return await response.json();
    } catch (error) {
        const err = new Error(
            `faqIngestion failed: ${error && error.message ? error.message : String(error)}`
        );
        err.originalError = error;
        throw err;
    }
}

export default faqIngestion;