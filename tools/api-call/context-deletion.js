import dotenv from "dotenv";

dotenv.config();

const CONTEXT_RETRIEVAL_SERVICE_URL  = process.env.CONTEXT_RETRIEVAL_SERVICE_URL;

async function deleteContextEndpoint(deleteOperation) {
    try {
        if (!deleteOperation || typeof deleteOperation !== "object") {
            throw new Error(
                "deleteOperation must be a valid object."
            );
        }

        const response = await fetch(
            `${CONTEXT_RETRIEVAL_SERVICE_URL}/api/delete`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(deleteOperation),
            }
        );

        if (!response.ok) {
            const errorResponse = await response.text();
            throw new Error(
                `Context deletion failed: ${errorResponse}`
            );
        }

        return await response.json();
    } catch (error) {
        const err = new Error(
            `deleteContextEndpoint failed: ${error && error.message ? error.message : String(error)}`
        );
        err.originalError = error;
        throw err;
    }
}

export default deleteContextEndpoint;
    
        
