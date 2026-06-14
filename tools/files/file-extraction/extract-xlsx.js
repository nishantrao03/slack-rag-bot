import xlsx from "xlsx";

async function extractXlsx(filePath) {
  try {
    const workbook = xlsx.readFile(filePath);

    let extractedText = "";

    for (const sheetName of workbook.SheetNames) {
      const worksheet = workbook.Sheets[sheetName];

      const sheetData = xlsx.utils.sheet_to_csv(
        worksheet
      );

      extractedText += sheetData;
      extractedText += "\n";
    }

    return extractedText;
  } catch (error) {
    const err = new Error(
      `extractXlsx failed: ${error && error.message ? error.message : String(error)}`
    );
    err.originalError = error;
    throw err;
  }
}

export default extractXlsx;
