import { mkdirSync, writeFileSync } from "node:fs";
import { existsSync } from "node:fs";
import { join } from "node:path";

export function ensureDir(path: string) {
  if (!existsSync(path)) {
    mkdirSync(path, { recursive: true });
  }
}

export function saveBase64Image(
  base64: string,
  outputDir: string,
  filename: string
): string {
  ensureDir(outputDir);
  const filepath = join(outputDir, filename);
  const data = Buffer.from(base64, "base64");
  writeFileSync(filepath, data);
  return filepath;
}
