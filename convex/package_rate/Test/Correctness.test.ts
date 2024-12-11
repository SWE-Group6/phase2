import { convexTest } from "convex-test";
import { expect, test, describe, beforeEach } from "vitest";
import schema from "../../schema"; // Assuming schema is defined for Convex

// Importing the Correctness class for testing
import { Correctness } from "../Models/Correctness";

let correctnessGithub: Correctness;
let correctnessNPM: Correctness;

beforeEach(() => {
  correctnessGithub = new Correctness("https://github.com/cloudinary/cloudinary_npm");
  correctnessNPM = new Correctness("https://www.npmjs.com/package/bootstrap");
});

describe("Correctness - GitHub", () => {
  test("Calculate the Correctness score", async () => {
    const t = convexTest(schema);
    await correctnessGithub.calculateScoreGithub();
    expect(correctnessGithub.getScore()).toBeGreaterThanOrEqual(0);
    expect(correctnessGithub.getScore()).toBeLessThanOrEqual(1);
  });

  test("Calculate the latency for Correctness", async () => {
    const t = convexTest(schema);
    await correctnessGithub.calculateScoreGithub();
    expect(typeof correctnessGithub.getLatency()).toBe("number");
  });

  test("Has a calculateScoreGithub method", () => {
    const t = convexTest(schema);
    expect(typeof correctnessGithub.calculateScoreGithub).toBe("function");
  });

  test("Returns a score between 0 and 1 after calculation", async () => {
    const t = convexTest(schema);
    await correctnessGithub.calculateScoreGithub();
    const score = correctnessGithub.getScore();
    expect(typeof score).toBe("number");
    expect(score).toBeGreaterThanOrEqual(0);
    expect(score).toBeLessThanOrEqual(1);
  });
});

describe("Correctness - NPM", () => {
  test("Calculate the Correctness score for NPM", async () => {
    const t = convexTest(schema);
    await correctnessNPM.calculateScoreNPM();
    expect(correctnessNPM.getScore()).toBeGreaterThanOrEqual(0);
    expect(correctnessNPM.getScore()).toBeLessThanOrEqual(1);
  });

  test("Calculate the latency for Correctness NPM", async () => {
    const t = convexTest(schema);
    await correctnessNPM.calculateScoreNPM();
    expect(typeof correctnessNPM.getLatency()).toBe("number");
  });

  test("Has a calculateScoreNPM method", () => {
    const t = convexTest(schema);
    expect(typeof correctnessNPM.calculateScoreNPM).toBe("function");
  });

  test("Returns a score between 0 and 1 after NPM calculation", async () => {
    const t = convexTest(schema);
    await correctnessNPM.calculateScoreNPM();
    const score = correctnessNPM.getScore();
    expect(typeof score).toBe("number");
    expect(score).toBeGreaterThanOrEqual(0);
    expect(score).toBeLessThanOrEqual(1);
  });
});

test("Correctness - Instance check", () => {
  const t = convexTest(schema);
  expect(correctnessGithub).toBeInstanceOf(Correctness);
  expect(correctnessNPM).toBeInstanceOf(Correctness);
});
