import mammoth from "mammoth";

async function extractDocx(filePath) {
  try {
    const result = await mammoth.extractRawText({
      path: filePath,
    });

    return result.value;
  } catch (error) {
    const err = new Error(
      `extractDocx failed: ${error && error.message ? error.message : String(error)}`
    );
    err.originalError = error;
    throw err;
  }
}

export default extractDocx;
