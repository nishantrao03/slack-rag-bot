import fs from "fs/promises";

async function downloadGdriveFile(
  googleDriveUrl,
  tempFilePath
) {
  if (!googleDriveUrl) {
    throw new Error(
      "googleDriveUrl is required."
    );
  }

  if (!tempFilePath) {
    throw new Error(
      "tempFilePath is required."
    );
  }

  let fileId = null;

  const patterns = [
    /\/file\/d\/([^/]+)/,
    /\/document\/d\/([^/]+)/,
    /\/spreadsheets\/d\/([^/]+)/
  ];

  for (const pattern of patterns) {
    const match =
      googleDriveUrl.match(pattern);

    if (match) {
      fileId = match[1];
      break;
    }
  }

  if (!fileId) {
    throw new Error(
      `Invalid Google Drive file URL ${googleDriveUrl}.`
    );
  }

  const downloadUrl =
    `https://drive.google.com/uc?export=download&id=${fileId}`;

  const response =
    await fetch(downloadUrl);

  if (!response.ok) {
    throw new Error(
      `Google Drive file download failed with status code ${response.status}`
    );
  }

  const fileBuffer =
    Buffer.from(
      await response.arrayBuffer()
    );

  await fs.writeFile(
    tempFilePath,
    fileBuffer
  );

  return tempFilePath;
}

export default downloadGdriveFile;