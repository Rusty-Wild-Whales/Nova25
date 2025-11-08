import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { resolve, join } from "node:path";
import { tmpdir } from "node:os";
import { randomUUID } from "node:crypto";
import { writeFile, unlink } from "node:fs/promises";

const execFileAsync = promisify(execFile);
const MAX_CHARS = 4000;

export async function summarizeWithModal(text: string, category: string): Promise<string | null> {
  const trimmed = text.slice(0, MAX_CHARS);
  const repoRoot = resolve(process.cwd(), "..");
  const tempPath = join(tmpdir(), `civiclens-${randomUUID()}.txt`);
  try {
    await writeFile(tempPath, trimmed, "utf-8");
    const { stdout } = await execFileAsync("modal", [
      "run",
      "modal_app/summarizer.py",
      "--text-file",
      tempPath,
      "--category",
      category
    ], {
      maxBuffer: 10 * 1024 * 1024,
      cwd: repoRoot
    });
    return stdout.trim();
  } catch (error) {
    console.error("Modal summarization failed", error);
    return null;
  } finally {
    await unlink(tempPath).catch(() => {});
  }
}
