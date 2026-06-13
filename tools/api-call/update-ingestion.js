import dotenv from "dotenv";

dotenv.config();

const CONTEXT_RETRIEVAL_SERVICE_URL  = process.env.CONTEXT_RETRIEVAL_SERVICE_URL;

async function updateIngestion(update_json, project_id) {
    if (!update_json || typeof update_json !== "object") {
        throw new Error(
            "update_json must be a valid object."
        );
    }

    if (!project_id || typeof project_id !== "string") {
        throw new Error(
            "project_id must be a valid string."
        );
    }

    // Construct FormData to send as multipart/form-data instead of JSON
    const formData = new FormData();
    formData.append("project_id", project_id);
    // Convert the update_json object into a string for the form payload
    formData.append("update_json", JSON.stringify(update_json));

    const response = await fetch(
        `${CONTEXT_RETRIEVAL_SERVICE_URL}/api/update`,
        {
            method: "POST",
            // The browser/Node automatically sets the appropriate Content-Type header with the boundary
            // when the body is a FormData instance.
            body: formData
        }
    );

    if (!response.ok) {
        const errorResponse = await response.text();
        throw new Error(
            `Update ingestion failed: ${errorResponse}`
        );
    }

    return await response.json();
}

export default updateIngestion;