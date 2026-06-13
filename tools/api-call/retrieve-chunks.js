// This is an API call to retrieve chunks for a given project ID and query from the RAG system.

// Input is simple, just project_id and query. 

// I am sharing the other route calls for reference, but they are not directly related to this API call. You must build this API, imports and all just like this file.

// import dotenv from "dotenv";

// dotenv.config();

// const CONTEXT_RETRIEVAL_SERVICE_URL  = process.env.CONTEXT_RETRIEVAL_SERVICE_URL;

// async function updateIngestion(update_json, project_id) {
//     if (!update_json || typeof update_json !== "object") {
//         throw new Error(
//             "update_json must be a valid object."
//         );
//     }

//     if (!project_id || typeof project_id !== "string") {
//         throw new Error(
//             "project_id must be a valid string."
//         );
//     }

//     // Construct FormData to send as multipart/form-data instead of JSON
//     const formData = new FormData();
//     formData.append("project_id", project_id);
//     // Convert the update_json object into a string for the form payload
//     formData.append("update_json", JSON.stringify(update_json));

//     const response = await fetch(
//         `${CONTEXT_RETRIEVAL_SERVICE_URL}/api/update`,
//         {
//             method: "POST",
//             // The browser/Node automatically sets the appropriate Content-Type header with the boundary
//             // when the body is a FormData instance.
//             body: formData
//         }
//     );

//     if (!response.ok) {
//         const errorResponse = await response.text();
//         throw new Error(
//             `Update ingestion failed: ${errorResponse}`
//         );
//     }

//     return await response.json();
// }

// export default updateIngestion;

// Here is the Python server route implementation which you need to call, so make sure to read it and understand the input and output format before you start coding the API call in JavaScript:

// from fastapi import APIRouter, HTTPException
// from pydantic import BaseModel

// from helpers.retrieval_helper import retrieve_chunks


// router = APIRouter()


// class RetrievalRequest(BaseModel):
//     query: str
//     project_id: str


// @router.post("/api/retrieve")
// async def retrieve_context(request: RetrievalRequest):
//     """
//     Handles retrieval API request and returns relevant chunks.
//     """
//     print(f"Received retrieval request: {request}")

//     try:
//         query = request.query
//         project_id = request.project_id
//         print(f"Received retrieval request for project_id: {project_id} with query: {query}")

//         if not query or not project_id:
//             raise HTTPException(
//                 status_code=400,
//                 detail="query and project_id are required"
//             )

//         chunks = await retrieve_chunks(query, project_id)
//         print(f"Retrieved chunks for project_id {project_id}: {chunks}")

//         return {
//             "status": "success",
//             "project_id": project_id,
//             "query": query,
//             "chunks": chunks
//         }

//     except HTTPException as http_err:
//         raise http_err

//     except Exception as e:
//         raise HTTPException(
//             status_code=500,
//             detail=f"retrieval_failed: {str(e)}"
//         )

import dotenv from "dotenv";

dotenv.config();

const CONTEXT_RETRIEVAL_SERVICE_URL  = process.env.CONTEXT_RETRIEVAL_SERVICE_URL;

async function retrieveChunks(
    query,
    project_id,
    apply_privacy_filter
) {
    if (
        !query
        || typeof query !==
            "string"
    ) {
        throw new Error(
            "query must be a valid string."
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

    if (
        typeof apply_privacy_filter !==
        "boolean"
    ) {
        throw new Error(
            "apply_privacy_filter must be a boolean."
        );
    }

    const response = await fetch(
        `${CONTEXT_RETRIEVAL_SERVICE_URL}/api/retrieve`,
        {
            method: "POST",
            headers: {
                "Content-Type":
                    "application/json"
            },
            body: JSON.stringify({
                query,
                project_id,
                apply_privacy_filter
            })
        }
    );

    if (!response.ok) {
        const errorResponse =
            await response.text();

        throw new Error(
            `Retrieve chunks failed: ${errorResponse}`
        );
    }

    return await response.json();
}

export default retrieveChunks;