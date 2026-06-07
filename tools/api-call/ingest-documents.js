import dotenv from "dotenv";

dotenv.config();

const CONTEXT_RETRIEVAL_SERVICE_URL  = process.env.CONTEXT_RETRIEVAL_SERVICE_URL;

async function ingestDocuments(filesMetadata) {
  if (!Array.isArray(filesMetadata)) {
    throw new Error(
      "filesMetadata must be an array."
    );
  }

  const response = await fetch(
    `${CONTEXT_RETRIEVAL_SERVICE_URL}/api/ingest`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(filesMetadata),
    }
  );

  if (!response.ok) {
    const errorResponse = await response.text();

    throw new Error(
      `Document ingestion failed: ${errorResponse}`
    );
  }

  return await response.json();
}

export default ingestDocuments;
