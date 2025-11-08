import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { resolve } from "node:path";

const execFileAsync = promisify(execFile);
const MAX_CHARS = 4000;

export async function summarizeWithModal(text: string, category: string): Promise<string | null> {
  const trimmed = text.slice(0, MAX_CHARS);
  try {
    const { stdout } = await execFileAsync("modal", [
      "run",
      "modal_app/summarizer.py",
      "--text",
      trimmed,
      "--category",
      category
    ], {
      maxBuffer: 10 * 1024 * 1024,
      cwd: resolve(process.cwd(), "..")
    });
    return stdout.trim();
  } catch (error) {
    console.error("Modal summarization failed", error);
    return null;
  }
}
