import fs from "fs/promises";
import { PDFParse } from "pdf-parse";

async function extractPdf(filePath) {
  const buffer = await fs.readFile(
    filePath
  );

  const parser = new PDFParse({
    data: buffer
  });

  try {
    const result =
      await parser.getText();

    return result.text;
  } finally {
    await parser.destroy();
  }
}

export default extractPdf;