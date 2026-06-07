// This function will call the API endpoint to ingest updates. The file must receive a update_json object and project_id as input. And then simply pass these to the API endpoint.  Then call the API endpoint and return the response.
// Make sure to handle imports and API endpoint URL like this file:

// import dotenv from "dotenv";

// dotenv.config();

// const CONTEXT_RETRIEVAL_SERVICE_URL  = process.env.CONTEXT_RETRIEVAL_SERVICE_URL;

// async function ingestDocuments(filesMetadata) {
//   if (!Array.isArray(filesMetadata)) {
//     throw new Error(
//       "filesMetadata must be an array."
//     );
//   }

//   const response = await fetch(
//     `${CONTEXT_RETRIEVAL_SERVICE_URL}/api/ingest`,
//     {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(filesMetadata),
//     }
//   );

//   if (!response.ok) {
//     const errorResponse = await response.text();

//     throw new Error(
//       `Document ingestion failed: ${errorResponse}`
//     );
//   }

//   return await response.json();
// }

// export default ingestDocuments;

// And this is the python route that the above function will call:

// import os
// import shutil
// import sys
// from typing import Optional
// from fastapi import APIRouter, UploadFile, File, Form, HTTPException

// current_dir = os.path.dirname(os.path.abspath(__file__))
// project_root = os.path.abspath(os.path.join(current_dir, '..'))
// if project_root not in sys.path:
//     sys.path.append(project_root)

// from helpers.context_update_builder import build_update_context

// router = APIRouter()

// TEMP_DIR = os.path.join(project_root, 'llm_helper')
// os.makedirs(TEMP_DIR, exist_ok=True)

// ALLOWED_EXTENSIONS = {".pdf", ".docx", ".pptx", ".xlsx", ".txt"}


// @router.post("/api/update")
// async def update_document(
//     project_id: str = Form(...),
//     # update_text: Optional[str] = Form(None),
//     # file: Optional[UploadFile] = File(None)
//     update_json: dict = Form(...)
// ):
//     """
//     Receives update input and processes it through context builder.
//     """

//     # # Validate input
//     # if not update_text and not file:
//     #     raise HTTPException(
//     #         status_code=400,
//     #         detail="You must provide either 'update_text' or a 'file'."
//     #     )

//     if not update_text:
//         raise HTTPException(
//             status_code=400,
//             detail="You must provide 'update_text' for the update operation."
//         )

//     # temp_file_path = None
//     # file_extension = None

//     # # Save uploaded file temporarily
//     # if file and file.filename:
//     #     _, file_extension = os.path.splitext(file.filename)
//     #     file_extension = file_extension.lower()

//     #     if file_extension not in ALLOWED_EXTENSIONS:
//     #         raise HTTPException(
//     #             status_code=400,
//     #             detail=(
//     #                 f"Unsupported file type: {file_extension}. "
//     #                 f"Allowed: {ALLOWED_EXTENSIONS}"
//     #             )
//     #         )

//     #     temp_file_path = os.path.join(TEMP_DIR, file.filename)

//     #     try:
//     #         with open(temp_file_path, "wb") as buffer:
//     #             shutil.copyfileobj(file.file, buffer)
//     #     except Exception as e:
//     #         raise HTTPException(
//     #             status_code=500,
//     #             detail=f"Failed to save file to disk: {str(e)}"
//     #         )

//     try:
//         # Await async context builder
//         processing_result = await build_update_context(
//             project_id=project_id,
//             update_text=update_text,
//             # file_path=temp_file_path,
//             # file_extension=file_extension
//         )

//         return processing_result

//     except Exception as e:
//         raise HTTPException(
//             status_code=500,
//             detail=f"Update Processing Error: {str(e)}"
//         )

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