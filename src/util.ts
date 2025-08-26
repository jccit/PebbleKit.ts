import path from "path";
import { fileURLToPath } from "url";

export const projectDir = process.cwd();
export const pktsDir = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  ".."
);
