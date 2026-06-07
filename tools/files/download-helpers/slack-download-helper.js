import fs from "fs/promises";
import dotenv from 'dotenv';
dotenv.config();

const SLACK_BOT_TOKEN =
  process.env.SLACK_BOT_TOKEN;

async function downloadSlackFile(
  fileUrl,
  tempFilePath
) {
console.log(fileUrl);

  if (!SLACK_BOT_TOKEN) {
    throw new Error(
      "SLACK_BOT_TOKEN is missing in environment variables."
    );
  }

  if (!fileUrl) {
    throw new Error(
      "fileUrl is required."
    );
  }

  if (!tempFilePath) {
    throw new Error(
      "tempFilePath is required."
    );
  }

  const response = await fetch(
    fileUrl,
    {
      headers: {
        Authorization: `Bearer ${SLACK_BOT_TOKEN}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error(
      `Slack file download failed with status code ${response.status}`
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

export default downloadSlackFile;