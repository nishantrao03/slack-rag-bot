import xlsx from "xlsx";

async function extractXlsx(filePath) {
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
}

export default extractXlsx;
