import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const outputPath = resolve(__dirname, "../public/data/portfolio.json");
const apiUrl = process.env.PUBLIC_DATA_API_URL || process.env.VITE_API_URL;
const exportKey = process.env.PUBLIC_DATA_EXPORT_KEY;

const fetchSnapshot = async () => {
  if (!apiUrl) {
    return null;
  }

  const url = `${apiUrl.replace(/\/$/, "")}/public-data`;
  const headers = exportKey ? { "x-static-export-key": exportKey } : {};
  const response = await fetch(url, { headers });

  if (!response.ok) {
    throw new Error(`Failed to fetch public data from ${url}: ${response.status}`);
  }

  return response.json();
};

try {
  const snapshot = await fetchSnapshot();

  if (!snapshot) {
    const existing = await readFile(outputPath, "utf8");
    JSON.parse(existing);
    console.log("No PUBLIC_DATA_API_URL or VITE_API_URL set. Keeping existing public data.");
    process.exit(0);
  }

  await mkdir(dirname(outputPath), { recursive: true });
  await writeFile(outputPath, `${JSON.stringify(snapshot, null, 2)}\n`);
  console.log(`Generated static portfolio data at ${outputPath}`);
} catch (error) {
  console.error(error.message);
  process.exit(1);
}
