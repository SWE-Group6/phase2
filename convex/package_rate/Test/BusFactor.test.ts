import { convexTest } from "convex-test";
import { expect, test } from "vitest";
import schema from "../../schema"; // Assuming schema is defined for Convex

// Importing the BusFactor class for testing
import { BusFactor } from "../Models/BusFactor";

test("BusFactor - Calculate BusFactor score", async () => {
  const t = convexTest(schema);
  const busFactor = new BusFactor("https://github.com/cloudinary/cloudinary_npm");

  await busFactor.calculateScoreGithub(); // Calculate the GitHub score
  expect(busFactor.getScore()).toBeGreaterThanOrEqual(0); // Score should be >= 0
  expect(busFactor.getScore()).toBeLessThanOrEqual(1); // Score should be <= 1
});

test("BusFactor - Calculate latency", async () => {
  const t = convexTest(schema);
  const busFactor = new BusFactor("https://github.com/cloudinary/cloudinary_npm");

  await busFactor.calculateScoreGithub(); // Ensure score calculation before checking latency
  expect(typeof busFactor.getLatency()).toBe("number"); // Latency should be a number
});

test("BusFactor - Instance check", async () => {
  const t = convexTest(schema);
  const busFactor = new BusFactor("https://github.com/cloudinary/cloudinary_npm");

  expect(busFactor).toBeInstanceOf(BusFactor); // Checking instance type
});
