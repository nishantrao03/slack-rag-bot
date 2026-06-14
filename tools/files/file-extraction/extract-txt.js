import fs from "fs/promises";

async function extractTxt(filePath) {
  try {
    const content = await fs.readFile(
      filePath,
      "utf-8"
    );

    return content;
  } catch (error) {
    const err = new Error(
      `extractTxt failed: ${error && error.message ? error.message : String(error)}`
    );
    err.originalError = error;
    throw err;
  }
}

export default extractTxt;