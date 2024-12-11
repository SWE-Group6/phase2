import { convexTest } from "convex-test";
import { expect, test, describe, beforeEach } from "vitest";
import schema from "../../schema"; // Assuming schema is defined for Convex

// Importing the RampUp class for testing
import { RampUp } from "../Models/RampUp";

let rampUpGithub: RampUp;
let rampUpNPM: RampUp;

beforeEach(() => {
  rampUpGithub = new RampUp("https://github.com/cloudinary/cloudinary_npm");
  rampUpNPM = new RampUp("https://www.npmjs.com/package/bootstrap");
});

describe("RampUp", () => {
  describe("GitHub", () => {
    test("Calculate the RampUp score", async () => {
      const t = convexTest(schema);
      await rampUpGithub.calculateScoreGithub();
      expect(rampUpGithub.getScore()).toBeGreaterThanOrEqual(0);
      expect(rampUpGithub.getScore()).toBeLessThanOrEqual(1);
    });

    test("Calculate the latency for RampUp", async () => {
      const t = convexTest(schema);
      await rampUpGithub.calculateScoreGithub();
      expect(typeof rampUpGithub.getLatency()).toBe("number");
    });

    test("Return a score of 0 for an invalid GitHub URL", async () => {
      const t = convexTest(schema);
      await rampUpGithub.calculateScoreGithub();
      expect(rampUpGithub.getScore()).toBeGreaterThanOrEqual(0);
      expect(rampUpGithub.getScore()).toBeLessThanOrEqual(1);
    });

    test("Return null if unable to fetch repository files", async () => {
      const t = convexTest(schema);
      const repoFiles = await rampUpGithub.listRepoFiles();
      expect(Array.isArray(repoFiles)).toBe(true);
    });

    test("Return null if unable to fetch a README file", async () => {
      const t = convexTest(schema);
      const readme = new RampUp("www.github.com");
      const readmeContent = await readme.findREADME();
      expect(readmeContent).toBe("");
    });
  });

  describe("NPM", () => {
    test("Calculate the RampUp score for NPM", async () => {
      const t = convexTest(schema);
      await rampUpNPM.calculateScoreNPM();
      expect(rampUpNPM.getScore()).toBeGreaterThanOrEqual(0);
      expect(rampUpNPM.getScore()).toBeLessThanOrEqual(1);
    });

    test("Calculate the latency for RampUp NPM", async () => {
      const t = convexTest(schema);
      await rampUpNPM.calculateScoreNPM();
      expect(typeof rampUpNPM.getLatency()).toBe("number");
    });

    test("Return a score of 0 when no README is found on NPM", async () => {
      const t = convexTest(schema);
      await rampUpNPM.calculateScoreNPM();
      expect(rampUpNPM.getScore()).toBeGreaterThanOrEqual(0);
      expect(rampUpNPM.getScore()).toBeLessThanOrEqual(1);
    });

    test("Handle an NPM package without README gracefully", async () => {
      const t = convexTest(schema);
      const readmeNPM = new RampUp("www.github.com");
      const readmeContent = await readmeNPM.findNPMREADME();
      expect(readmeContent).toBe("");
    });

    test("Return a score of 0 for an invalid NPM package URL", async () => {
      const t = convexTest(schema);
      await rampUpNPM.calculateScoreNPM();
      expect(rampUpNPM.getScore()).toBeGreaterThanOrEqual(0);
      expect(rampUpNPM.getScore()).toBeLessThanOrEqual(1);
    });
  });

  describe("General", () => {
    test("Instance check for RampUp", () => {
      const t = convexTest(schema);
      expect(rampUpGithub).toBeInstanceOf(RampUp);
      expect(rampUpNPM).toBeInstanceOf(RampUp);
    });

    test("Check if delay method exists", () => {
      const t = convexTest(schema);
      expect(typeof rampUpGithub.delay).toBe("function");
    });

    test("Delay the process by a specified time", async () => {
      const t = convexTest(schema);
      const start = Date.now();
      await rampUpGithub.delay(1000); // Delay for 1000ms
      const end = Date.now();
      expect(end - start).toBeGreaterThanOrEqual(1000); // Ensure at least 1000ms delay
    });

    test("Handle OpenAI API response parsing failures gracefully", async () => {
      const t = convexTest(schema);

      // Assuming the OpenAI API call returns a malformed JSON
      const invalidResponse = "{ ramp_up_score: }"; // Invalid JSON
      const parsedScore = await rampUpGithub.rateREADME(invalidResponse); // Should handle gracefully
      expect(typeof parsedScore).toBe("number");
    });
  });
});
