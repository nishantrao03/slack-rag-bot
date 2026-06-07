import mammoth from "mammoth";

async function extractDocx(filePath) {
  const result = await mammoth.extractRawText({
    path: filePath,
  });

  return result.value;
}

export default extractDocx;
