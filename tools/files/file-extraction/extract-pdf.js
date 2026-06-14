import fs from "fs/promises";
import { PDFParse } from "pdf-parse";

async function extractPdf(filePath) {
  try {
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
  } catch (error) {
    const err = new Error(
      `extractPdf failed: ${error && error.message ? error.message : String(error)}`
    );
    err.originalError = error;
    throw err;
  }
}

export default extractPdf;