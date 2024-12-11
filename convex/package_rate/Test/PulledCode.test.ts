import { convexTest } from "convex-test";
import { expect, test, describe } from "vitest";
import schema from "../../schema"; // Assuming schema is defined for Convex

// Importing the PulledCode class for testing
import { PulledCode } from "../Models/PulledCode";

describe("PulledCode", () => {
  describe("Final Output of PulledCode score", () => {
    test(
      "Calculate the PulledCode score",
      async () => {
        const t = convexTest(schema);
        const pulledCode = new PulledCode("https://github.com/cloudinary/cloudinary_npm");
        await pulledCode.calculateScoreGithub();
        expect(pulledCode.getScore()).toBeGreaterThanOrEqual(0);
        expect(pulledCode.getScore()).toBeLessThanOrEqual(1);
      },
      60000 // Timeout
    );

    test(
      "Calculate the latency for PulledCode",
      async () => {
        const t = convexTest(schema);
        const pulledCode = new PulledCode("https://github.com/cloudinary/cloudinary_npm");
        await pulledCode.calculateScoreGithub();
        expect(typeof pulledCode.getLatency()).toBe("number");
      },
      60000 // Timeout
    );

    test("Instance check for PulledCode", () => {
      const t = convexTest(schema);
      const pulledCode = new PulledCode("https://github.com/cloudinary/cloudinary_npm");
      expect(pulledCode).toBeInstanceOf(PulledCode);
    });
  });

  /*
  describe("getPullLinesOfCode", () => {
    test("Return lines of code coming from pull requests", async () => {
      const t = convexTest(schema);
      const pulledcode = new PulledCode("");
      const pull_lines = await pulledcode.getPullLinesOfCode("SWE-Group6", "phase1");
      expect(pull_lines).toBe(8442);
    });
  });

  describe("getTotalCodeLines", () => {
    const expectedTotalLines = 11127; // Your expected total lines of code
    const delta = expectedTotalLines * 0.05;

    test(
      "Return the correct total lines of code",
      async () => {
        const t = convexTest(schema);
        const pulledcode = new PulledCode("https://github.com/SWE-Group6/phase1");
        const totalLines = await pulledcode.getTotalCodeLines(
          "SWE-Group6",
          "Software-Engineering-Project"
        );
        expect(totalLines).toBeCloseTo(expectedTotalLines, delta);
      },
      60000 // Timeout
    );
  });

  describe("analyzeUrl", () => {
    test("Return the correct owner and repo", () => {
      const t = convexTest(schema);
      const pulledcode = new PulledCode("https://github.com/SWE-Group6/phase1");
      const result = pulledcode.analyzeUrl("https://github.com/microsoft/TypeScript");
      expect(result).toEqual({
        owner: "microsoft",
        repo: "TypeScript", // Make sure the repo name matches case sensitivity
      });
    });
  });

  describe("getGitHubUrl", () => {
    test("Return the correct GitHub URL", async () => {
      const t = convexTest(schema);
      const pulledcode = new PulledCode("https://www.npmjs.com/package/typescript");
      const gitHubUrl = await pulledcode.getGitHubUrl();
      expect(gitHubUrl).toBe("https://github.com/microsoft/TypeScript");
    });
  });
  */
});
