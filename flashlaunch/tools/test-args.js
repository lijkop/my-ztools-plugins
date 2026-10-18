const { splitArgs } = require("../utils/args");

const cases = [
  ["", []],
  ['--foo "a b" C:\\x', ["--foo", "a b", "C:\\x"]],
  ["--name=test", ["--name=test"]],
  ['"C:\\Program Files\\App\\a.exe" --flag', ["C:\\Program Files\\App\\a.exe", "--flag"]],
  ['--x "he said \\"hi\\""', ["--x", 'he said "hi"']],
  ["a\\b", ["a\\b"]],
  ["  spaced   out  ", ["spaced", "out"]],
];

let failed = 0;
for (const [input, expected] of cases) {
  const actual = splitArgs(input);
  const ok = JSON.stringify(actual) === JSON.stringify(expected);
  if (!ok) failed += 1;
  console.log((ok ? "PASS" : "FAIL") + "  " + JSON.stringify(input) + " -> " + JSON.stringify(actual));
}
if (failed) {
  console.error(failed + " case(s) failed");
  process.exit(1);
}
console.log("all args cases passed");
