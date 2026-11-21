// main.ts — make.fun entry program: "The joke about the demo".
//
// One line of text goes to <output>/entry.txt. The line is composed here, in
// code, from fixed parts, so both graded runs write the same bytes. No network,
// no dependencies, nothing read from disk: the Node standard library only.
//
// Contract: /output/entry.txt, UTF-8, 1..280 Unicode code points, not only
// white space. OUTPUT_DIR (or MAKEFUN_OUTPUT_DIR) overrides /output for local
// runs.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";

const SETUP = "My agent forgot yesterday's architecture decisions";
const ESCALATION = "and rebuilt the service from scratch";
const PUNCHLINE = "it is now the most senior engineer on the team";

const LINE = `${SETUP} ${ESCALATION}; ${PUNCHLINE}.`;

// The gate counts code points, not bytes, and refuses blank text.
function assertGate(text) {
  const points = [...text].length;
  if (points < 1 || points > 280) throw new Error(`gate: ${points} code points`);
  if (text.trim() === "") throw new Error("gate: blank entry");
  return points;
}

const points = assertGate(LINE);
const outputDir = resolve(process.env.OUTPUT_DIR ?? process.env.MAKEFUN_OUTPUT_DIR ?? "/output");
mkdirSync(outputDir, { recursive: true });

const target = join(outputDir, "entry.txt");
writeFileSync(target, LINE, "utf8");

// Read back once: the graded run must hand over exactly the line composed above.
if (readFileSync(target, "utf8") !== LINE) throw new Error("write: read-back mismatch");

console.log(`entry: ${target} (${points} code points, ${Buffer.byteLength(LINE)} bytes)`);
