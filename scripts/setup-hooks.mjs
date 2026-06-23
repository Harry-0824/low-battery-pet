import { execFileSync } from "node:child_process";

function runGit(args) {
  return execFileSync("git", args, {
    encoding: "utf8",
    stdio: ["ignore", "pipe", "ignore"]
  }).trim();
}

if (process.env.CI) {
  process.exit(0);
}

try {
  if (runGit(["rev-parse", "--is-inside-work-tree"]) !== "true") {
    process.exit(0);
  }
} catch {
  process.exit(0);
}

try {
  if (runGit(["config", "--get", "core.hooksPath"]) === ".githooks") {
    process.exit(0);
  }
} catch {
  // Missing hooksPath is expected on first install.
}

try {
  execFileSync("git", ["config", "core.hooksPath", ".githooks"], {
    stdio: "ignore"
  });
  console.log("Configured git hooks path: .githooks");
} catch {
  console.warn("Skipping git hook setup.");
}
