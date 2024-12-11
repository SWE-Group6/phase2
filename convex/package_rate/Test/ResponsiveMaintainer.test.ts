import { convexTest } from "convex-test";
import { expect, test, describe, beforeEach } from "vitest";
import schema from "../../schema"; // Assuming schema is defined for Convex

// Importing the ResponsiveMaintainer class for testing
import { ResponsiveMaintainer } from "../Models/ResponsiveMaintainer";

let responsiveMaintainerGithub: ResponsiveMaintainer;
let responsiveMaintainerNPM: ResponsiveMaintainer;

beforeEach(() => {
  responsiveMaintainerGithub = new ResponsiveMaintainer("https://github.com/cloudinary/cloudinary_npm");
  responsiveMaintainerNPM = new ResponsiveMaintainer("https://www.npmjs.com/package/bootstrap");
});

describe("ResponsiveMaintainer", () => {
  describe("GitHub", () => {
    test("Calculate the ResponsiveMaintainer score", async () => {
      const t = convexTest(schema);
      await responsiveMaintainerGithub.calculateScoreGithub();
      expect(responsiveMaintainerGithub.getScore()).toBeGreaterThanOrEqual(0);
      expect(responsiveMaintainerGithub.getScore()).toBeLessThanOrEqual(1);
    });

    test("Calculate the latency for ResponsiveMaintainer", async () => {
      const t = convexTest(schema);
      await responsiveMaintainerGithub.calculateScoreGithub();
      expect(typeof responsiveMaintainerGithub.getLatency()).toBe("number");
    });

    test("Check if calculateScoreGithub method exists", () => {
      const t = convexTest(schema);
      expect(typeof responsiveMaintainerGithub.calculateScoreGithub).toBe("function");
    });

    test("Return a score between 0 and 1 after calculation", async () => {
      const t = convexTest(schema);
      await responsiveMaintainerGithub.calculateScoreGithub();
      const score = responsiveMaintainerGithub.getScore();
      expect(typeof score).toBe("number");
      expect(score).toBeGreaterThanOrEqual(0);
      expect(score).toBeLessThanOrEqual(1);
    });
  });

  describe("NPM", () => {
    test("Calculate the ResponsiveMaintainer score for NPM", async () => {
      const t = convexTest(schema);
      await responsiveMaintainerNPM.calculateScoreNPM();
      expect(responsiveMaintainerNPM.getScore()).toBeGreaterThanOrEqual(0);
      expect(responsiveMaintainerNPM.getScore()).toBeLessThanOrEqual(1);
    });

    test("Calculate the latency for ResponsiveMaintainer NPM", async () => {
      const t = convexTest(schema);
      await responsiveMaintainerNPM.calculateScoreNPM();
      expect(typeof responsiveMaintainerNPM.getLatency()).toBe("number");
    });
  });
});
