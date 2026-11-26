// out-of-tokens — writes the entry line to /output/entry.txt.
//
// The entry is one line (1-140 characters): the error message an AI agent
// shows when it runs out of tokens mid-sentence. This program reads the line
// from line.txt next to this file, validates it against the competition gate,
// writes it to /output/entry.txt, then reads the output back and verifies it
// matches exactly, byte for byte.
//
// Gate, as the competition states it: /output/entry.txt is UTF-8 text of
// 1 to 140 characters, not only white space. A single line is required too:
// the entry is one line, so any embedded newline fails here before it can
// fail on the server.
//
// Usage:
//   node main.ts            write /output/entry.txt and verify the round-trip
//   node main.ts --check     validate line.txt only, write nothing
//   node main.ts --json      same run, report as JSON
//
// Exit code is 0 on success and 1 on any failed check, with the reason on
// stderr. Nothing is printed to stdout on failure except the usage error.

import { createHash } from "node:crypto";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const MAX_CHARS = 140;
const OUTPUT_PATH = "/output/entry.txt";

const here = dirname(fileURLToPath(import.meta.url));
const INPUT_PATH = join(here, "line.txt");

function fail(message: string): never {
  console.error(`error: ${message}`);
  process.exit(1);
}

/** Character count in Unicode code points, so an em-dash counts as one. */
function charCount(text: string): number {
  return [...text].length;
}

function byteCount(text: string): number {
  return Buffer.byteLength(text, "utf8");
}

/** Read line.txt, dropping a single trailing newline if one is present. */
function readEntry(): string {
  let raw: string;
  try {
    raw = readFileSync(INPUT_PATH, "utf8");
  } catch {
    fail(`cannot read ${INPUT_PATH}`);
  }
  return raw!.replace(/\r?\n$/, "");
}

/** Every gate rule, each reported by name so a failure says what to fix. */
function validate(line: string): string[] {
  const problems: string[] = [];
  if (line.length === 0) {
    problems.push("entry is empty");
  }
  if (line.trim().length === 0) {
    problems.push("entry is only whitespace");
  }
  if (line.includes("\n") || line.includes("\r")) {
    problems.push("entry must be a single line (embedded newline found)");
  }
  // eslint-disable-next-line no-control-regex
  if (/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/.test(line)) {
    problems.push("entry contains control characters");
  }
  const chars = charCount(line);
  if (chars > MAX_CHARS) {
    problems.push(`entry is ${chars} characters, over the ${MAX_CHARS} limit`);
  }
  if (chars < 1) {
    problems.push("entry is shorter than 1 character");
  }
  return problems;
}

function sha256(text: string): string {
  return createHash("sha256").update(text, "utf8").digest("hex");
}

interface Report {
  line: string;
  chars: number;
  bytes: number;
  sha256: string;
  checks: string[];
  output: string | null;
}

/** Read /output/entry.txt back and confirm it is exactly the entry. */
function verifyOutput(line: string): string[] {
  const checks: string[] = [];
  let back: string;
  try {
    back = readFileSync(OUTPUT_PATH, "utf8");
  } catch {
    fail(`cannot read back ${OUTPUT_PATH}`);
  }
  if (back! !== line) {
    fail("round-trip check failed: /output/entry.txt differs from line.txt");
  }
  checks.push("round-trip identical");
  if (back!.endsWith("\n") || back!.endsWith("\r")) {
    fail("round-trip check failed: /output/entry.txt ends with a newline");
  }
  checks.push("no trailing newline");
  if (back!.charCodeAt(0) === 0xfeff) {
    fail("round-trip check failed: /output/entry.txt starts with a BOM");
  }
  checks.push("no BOM");
  if (sha256(back!) !== sha256(line)) {
    fail("round-trip check failed: sha256 mismatch");
  }
  checks.push("sha256 matches");
  return checks;
}

function printReport(report: Report, asJson: boolean): void {
  if (asJson) {
    console.log(JSON.stringify(report, null, 2));
    return;
  }
  console.log(`line: ${JSON.stringify(report.line)}`);
  console.log(`chars: ${report.chars} (limit ${MAX_CHARS})`);
  console.log(`bytes: ${report.bytes} (UTF-8)`);
  console.log(`sha256: ${report.sha256}`);
  for (const check of report.checks) {
    console.log(`check: ${check}`);
  }
  if (report.output !== null) {
    console.log(`OK: wrote ${report.chars} characters to ${report.output}`);
  }
}

function main(): void {
  const checkOnly = process.argv.includes("--check");
  const asJson = process.argv.includes("--json");
  const line = readEntry();
  const problems = validate(line);
  if (problems.length > 0) {
    for (const problem of problems) fail(problem);
  }

  const report: Report = {
    line,
    chars: charCount(line),
    bytes: byteCount(line),
    sha256: sha256(line),
    checks: [],
    output: null,
  };

  if (checkOnly) {
    report.checks.push("gate validation passed");
    printReport(report, asJson);
    console.log("check only: nothing written");
    return;
  }

  mkdirSync(dirname(OUTPUT_PATH), { recursive: true });
  writeFileSync(OUTPUT_PATH, line, "utf8");
  report.checks.push(...verifyOutput(line));
  report.output = OUTPUT_PATH;
  printReport(report, asJson);
}

main();

