import fs from "fs/promises";
import path from "path";
import pLimit from "p-limit";

import downloadSlackFile from "./download-helpers/slack-download-helper.js";
import downloadGdriveFile from "./download-helpers/gdrive-download-helper.js";

import extractPdf from "./file-extraction/extract-pdf.js";
import extractDocx from "./file-extraction/extract-docx.js";
import extractXlsx from "./file-extraction/extract-xlsx.js";
import extractTxt from "./file-extraction/extract-txt.js";

const CONCURRENCY_LIMIT = 8;

const TEMP_UPLOADS_DIR = path.join(
  process.cwd(),
  "temp-uploads"
);

async function extractFileContent(
  tempFilePath,
  documentType
) {
  const normalizedType =
    documentType.toLowerCase();

  switch (normalizedType) {
    case "pdf":
      return await extractPdf(
        tempFilePath
      );

    case "docx":
      return await extractDocx(
        tempFilePath
      );

    case "xlsx":
      return await extractXlsx(
        tempFilePath
      );

    case "txt":
      return await extractTxt(
        tempFilePath
      );

    default:
      throw new Error(
        `Unsupported document type: ${documentType}`
      );
  }
}

async function processFile(
  file,
  index,
  contentArray
) {
  const {
    source,
    document_type,
    document_name
  } = file;

  const fileLink =
    file.fileLink ??
    file["file-link"];

  if (!fileLink) {
    throw new Error(
      "fileLink is required."
    );
  }

  if (!source) {
    throw new Error(
      "source is required."
    );
  }

  if (!document_type) {
    throw new Error(
      "document_type is required."
    );
  }

  if (!document_name) {
    throw new Error(
      "document_name is required."
    );
  }

  const parsedName = path.parse(
    document_name
  );

  const tempFileName =
    `${parsedName.name}-file-${index}${parsedName.ext}`;

  const tempFilePath = path.join(
    TEMP_UPLOADS_DIR,
    tempFileName
  );

  console.log(
    `[File ${index}] Started: ${document_name}`
  );

  try {
    if (source === "slack") {
      await downloadSlackFile(
        fileLink,
        tempFilePath
      );
    } else if (source === "gdrive") {
      await downloadGdriveFile(
        fileLink,
        tempFilePath
      );
    } else {
      throw new Error(
        `Unsupported source: ${source}`
      );
    }

    console.log(
      `[File ${index}] Download Completed: ${document_name}`
    );

    const extractedContent =
      await extractFileContent(
        tempFilePath,
        document_type
      );

    contentArray[index] =
      extractedContent;

    console.log(
      `[File ${index}] Extraction Completed: ${document_name}`
    );
  } finally {
    try {
      await fs.unlink(
        tempFilePath
      );

      console.log(
        `[File ${index}] Cleanup Completed: ${document_name}`
      );
    } catch {
      // Ignore cleanup failures
    }
  }
}

async function buildUpdateText(
  files
) {
  try {
    if (!Array.isArray(files)) {
      throw new Error(
        "files must be an array."
      );
    }

    await fs.mkdir(
      TEMP_UPLOADS_DIR,
      {
        recursive: true
      }
    );

    const contentArray =
      new Array(files.length);

    const limit = pLimit(
      CONCURRENCY_LIMIT
    );

    console.log(
      `[Update Builder] Starting processing for ${files.length} files`
    );

    await Promise.all(
      files.map(
        (file, index) =>
          limit(() =>
            processFile(
              file,
              index,
              contentArray
            )
          )
      )
    );

    console.log(
      "[Update Builder] All file processing completed"
    );

    const updateText =
      contentArray.join("\n\n");

    console.log(
      "[Update Builder] updateText generated successfully"
    );

    return updateText;
  } catch (error) {
    const err = new Error(
      `buildUpdateText failed: ${error && error.message ? error.message : String(error)}`
    );
    err.originalError = error;
    throw err;
  }
}

export default buildUpdateText;