import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const readJson = async (name) => JSON.parse(
  await readFile(new URL(`../${name}`, import.meta.url), "utf8"),
);

test("public preset keeps age-qualified automerge guarded by CI", async () => {
  const preset = await readJson("default.json");

  assert.deepEqual(preset.extends, ["config:best-practices"]);
  assert.equal(preset.automerge, false);
  assert.equal(preset.minimumReleaseAge, "14 days");
  assert.equal(preset.minimumReleaseAgeBehaviour, "timestamp-optional");
  assert.equal(preset.internalChecksFilter, "strict");
  assert.equal(preset.internalChecksAsSuccess, false);
  assert.equal(preset.ignoreTests, false);
  assert.equal(preset.automergeType, "pr");
  assert.equal(preset.automergeStrategy, "squash");
  assert.equal(preset.platformAutomerge, false);
  assert.equal(preset.vulnerabilityAlerts.automerge, true);
  assert.equal(preset.vulnerabilityAlerts.minimumReleaseAge, "3 days");
  assert.equal(preset.lockFileMaintenance.enabled, false);

  const manualRule = preset.packageRules.find((rule) => rule.matchUpdateTypes?.includes("pin"));
  assert.ok(manualRule);
  assert.equal(manualRule.automerge, false);
  assert.equal(manualRule.groupSlug, "manual-dependency-maintenance");

  const missingAgeRule = preset.packageRules.find((rule) => rule.matchJsonata?.some((expression) => expression.includes("releaseTimestamp")));
  assert.ok(missingAgeRule);
  assert.equal(missingAgeRule.automerge, false);

  const ageRule = preset.packageRules.find((rule) => rule.automerge === true);
  assert.ok(ageRule);
  assert.deepEqual(ageRule.matchUpdateTypes, ["major", "minor", "patch"]);
  assert.match(ageRule.matchJsonata[0], /newVersionAgeInDays >= 14/);
});

test("manual preset disables every automerge path and maintains one rolling PR", async () => {
  const preset = await readJson("manual.json");

  assert.deepEqual(preset.extends, ["./default"]);
  assert.equal(preset.automerge, false);
  assert.equal(preset.platformAutomerge, false);
  assert.equal(preset.prConcurrentLimit, 1);
  assert.equal(preset.branchConcurrentLimit, 1);
  assert.equal(preset.separateMajorMinor, false);
  assert.equal(preset.separateMinorPatch, false);
  assert.equal(preset.vulnerabilityAlerts.automerge, false);
  assert.equal(preset.vulnerabilityAlerts.minimumReleaseAge, "3 days");
  assert.equal(preset.vulnerabilityAlerts.groupName, "All dependency updates");
  assert.equal(preset.vulnerabilityAlerts.groupSlug, "all-dependency-updates");

  const publicPreset = await readJson("default.json");
  assert.equal(publicPreset.vulnerabilityAlerts.automerge, true);

  const rollingRule = preset.packageRules.find((rule) => rule.groupSlug === "all-dependency-updates");
  assert.ok(rollingRule);
  assert.equal(rollingRule.automerge, false);
  assert.equal(rollingRule.recreateWhen, "always");
  assert.deepEqual(
    new Set(rollingRule.matchUpdateTypes),
    new Set([
      "major",
      "minor",
      "patch",
      "pin",
      "pinDigest",
      "digest",
      "rollback",
      "replacement",
      "bump",
      "lockfileUpdate",
    ]),
  );

  const repositoryPolicy = await readJson("renovate.json");
  assert.equal(repositoryPolicy.automerge, false);
  assert.equal(repositoryPolicy.platformAutomerge, false);
  assert.equal(repositoryPolicy.minimumReleaseAge, "14 days");
  assert.equal(repositoryPolicy.minimumReleaseAgeBehaviour, "timestamp-optional");
  assert.equal(repositoryPolicy.prConcurrentLimit, 1);
  assert.equal(repositoryPolicy.branchConcurrentLimit, 1);
  assert.equal(repositoryPolicy.osvVulnerabilityAlerts, true);
  assert.equal(repositoryPolicy.vulnerabilityAlerts.automerge, false);
  assert.equal(repositoryPolicy.vulnerabilityAlerts.groupSlug, "renovate-policy-dependencies");
});
