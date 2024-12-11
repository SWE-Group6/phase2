import { convexTest } from "convex-test";
import { expect, test, describe } from "vitest";
import schema from "../../schema"; // Assuming schema is defined for Convex

// Importing the DependencyPinning class for testing
import { DependencyPinning } from "../Models/DependencyPinning";

describe("DependencyPinning", () => {
  describe("Final Output of dependencyPinning score", () => {
    test(
      "Calculate the dependencyPinning score",
      async () => {
        const t = convexTest(schema);
        const dependencyPinning = new DependencyPinning("https://github.com/cloudinary/cloudinary_npm");
        await dependencyPinning.calculateScoreGithub();
        expect(dependencyPinning.getScore()).toBeGreaterThanOrEqual(0);
        expect(dependencyPinning.getScore()).toBeLessThanOrEqual(1);
      },
      60000 // Timeout
    );

    test(
      "Calculate the latency for dependencyPinning",
      async () => {
        const t = convexTest(schema);
        const dependencyPinning = new DependencyPinning("https://github.com/cloudinary/cloudinary_npm");
        await dependencyPinning.calculateScoreGithub();
        expect(typeof dependencyPinning.getLatency()).toBe("number");
      },
      60000 // Timeout
    );

    test("Instance check for DependencyPinning", () => {
      const t = convexTest(schema);
      const dependencyPinning = new DependencyPinning("https://github.com/cloudinary/cloudinary_npm");
      expect(dependencyPinning).toBeInstanceOf(DependencyPinning);
    });
  });

  describe("getPackageJSON", () => {
    test("Return package.JSON file in string format", async () => {
      const t = convexTest(schema);
      const dependencyPinning = new DependencyPinning("https://github.com/cloudinary/cloudinary_npm");
      const packageJSON_File = await dependencyPinning.getPackageJSON("cloudinary", "cloudinary_npm");
      expect(typeof packageJSON_File).toBe("string");
    });
  });

  describe("CalculatePinningScore", () => {
    test(
      "Return the dependency fraction value based on the package.JSON file (cloudinary/cloudinary_npm)",
      async () => {
        const t = convexTest(schema);
        const dependencyPinning = new DependencyPinning("https://github.com/cloudinary/cloudinary_npm");
        const jsonString = await dependencyPinning.getPackageJSON("cloudinary", "cloudinary_npm");
        const score = await dependencyPinning.calculatePinningScore(jsonString);
        expect(score).toBeCloseTo(3 / 23, 5); // Using `toBeCloseTo` for floating-point precision
      },
      60000 // Timeout
    );

    test(
      "Return the dependency fraction value based on the package.JSON file (facebook/react)",
      async () => {
        const t = convexTest(schema);
        const dependencyPinning = new DependencyPinning("https://github.com/facebook/react");
        const jsonString = await dependencyPinning.getPackageJSON("facebook", "react");
        const score = await dependencyPinning.calculatePinningScore(jsonString);
        expect(score).toBeCloseTo(2 / 98, 5); // Using `toBeCloseTo` for floating-point precision
      },
      60000 // Timeout
    );
  });
});
