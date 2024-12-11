import { convexTest } from "convex-test";
import { expect, test } from "vitest";
import schema from "../../schema"; // Assuming schema is defined for Convex

// Importing the AllMetrics class for testing
import { AllMetrics } from "../Models/AllMetrics";

test("AllMetrics - Initialize all metrics", async () => {
  const t = convexTest(schema);
  const allMetrics = new AllMetrics("https://github.com/lodash/lodash");

  expect(allMetrics.metrics.length).toBe(7); // Expecting 5 metrics to be initialized
});

test("AllMetrics - Instance check", async () => {
  const t = convexTest(schema);
  const allMetrics = new AllMetrics("https://github.com/lodash/lodash");

  expect(allMetrics).toBeInstanceOf(AllMetrics); // Checking instance type
});

test("AllMetrics - Calculate net score", async () => {
  const t = convexTest(schema);
  const allMetrics = new AllMetrics("https://github.com/lodash/lodash");

  await allMetrics.calculateNetScore(); // Calculating net score
  expect(allMetrics.getNetScore()).toBeGreaterThanOrEqual(0); // Net score should be >= 0
  expect(allMetrics.getNetScore()).toBeLessThanOrEqual(1); // Net score should be <= 1
});

test("AllMetrics - Calculate latency", async () => {
  const t = convexTest(schema);
  const allMetrics = new AllMetrics("https://github.com/lodash/lodash");

  await allMetrics.calculateNetScore(); // Ensure score calculation before checking latency
  expect(typeof allMetrics.getNetScoreLatency()).toBe("number"); // Latency should be a number
});

test("AllMetrics - Check URL type for GitHub", async () => {
  const t = convexTest(schema);
  const allMetrics = new AllMetrics("https://github.com/lodash/lodash");

  expect(allMetrics.checkUrlType("https://github.com/lodash/lodash")).toBe("github");
});

test("AllMetrics - Check URL type for npm", async () => {
  const t = convexTest(schema);
  const allMetrics = new AllMetrics("https://github.com/lodash/lodash");

  expect(allMetrics.checkUrlType("https://www.npmjs.com/package/bootstrap")).toBe("npm");
});

test("AllMetrics - Check URL type for invalid URL", async () => {
  const t = convexTest(schema);
  const allMetrics = new AllMetrics("https://github.com/lodash/lodash");

  expect(allMetrics.checkUrlType("www.example.com")).toBe("unknown");
});
