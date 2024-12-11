import { convexTest } from "convex-test";
import { expect, test, describe, beforeEach } from "vitest";
import schema from "../../schema"; // Assuming schema is defined for Convex

// Importing the License class for testing
import { License } from "../Models/License";

let licenseGithub: License;
let licenseNPM: License;

beforeEach(() => {
  licenseGithub = new License("https://github.com/cloudinary/cloudinary_npm");
  licenseNPM = new License("https://www.npmjs.com/package/bootstrap");
});

describe("License", () => {
  // GitHub License Tests
  describe("GitHub", () => {
    test("Calculate the License score", async () => {
      const t = convexTest(schema);
      await licenseGithub.calculateScoreGithub();
      expect(licenseGithub.getScore()).toBeGreaterThanOrEqual(0);
      expect(licenseGithub.getScore()).toBeLessThanOrEqual(1);
    });

    test("Calculate the latency for License", async () => {
      const t = convexTest(schema);
      await licenseGithub.calculateScoreGithub();
      expect(typeof licenseGithub.getLatency()).toBe("number");
    });

    test("Has a calculateScoreGithub method", () => {
      const t = convexTest(schema);
      expect(typeof licenseGithub.calculateScoreGithub).toBe("function");
    });

    test("Returns a score between 0 and 1 after calculation", async () => {
      const t = convexTest(schema);
      await licenseGithub.calculateScoreGithub();
      const score = licenseGithub.getScore();
      expect(typeof score).toBe("number");
      expect(score).toBeGreaterThanOrEqual(0);
      expect(score).toBeLessThanOrEqual(1);
    });

    test("Lists files in the GitHub repository", async () => {
      const t = convexTest(schema);
      const files = await licenseGithub.listRepoFiles("cloudinary", "cloudinary_npm");
      expect(Array.isArray(files)).toBe(true);
      expect(files.length).toBeGreaterThan(0);
    });

    test("Returns an empty array if the GitHub repository does not exist", async () => {
      const t = convexTest(schema);
      const files = await licenseGithub.listRepoFiles("invalid-owner", "invalid-repo");
      expect(Array.isArray(files)).toBe(true);
      expect(files.length).toBe(0);
    });

    test("Gets a specific file from the GitHub repository", async () => {
      const t = convexTest(schema);
      const fileData = await licenseGithub.getFile("cloudinary", "cloudinary_npm", "README.md");
      expect(fileData).toHaveProperty("content");
    });

    test("Returns null for a non-existent file in the GitHub repository", async () => {
      const t = convexTest(schema);
      const fileData = await licenseGithub.getFile("cloudinary", "cloudinary_npm", "non-existent-file.txt");
      expect(fileData).toBeNull();
    });

    test("Decodes a base64 string to utf-8", () => {
      const encoded = Buffer.from("Hello, World!").toString("base64");
      const decoded = licenseGithub.decodeFile(encoded);
      expect(decoded).toBe("Hello, World!");
    });

    test("Parses the license field from a package.json string", () => {
      const jsonString = JSON.stringify({ license: "MIT" });
      const licenseType = licenseGithub.parseJSON(jsonString);
      expect(licenseType).toBe("MIT");
    });

    test("Returns null for an invalid JSON string", () => {
      const invalidJSONString = "{ license: 'MIT'";
      const licenseType = licenseGithub.parseJSON(invalidJSONString);
      expect(licenseType).toBeNull();
    });

    test("Identifies an MIT license in a file content", () => {
      const licenseContent = "Permission is hereby granted... MIT License...";
      const licenseType = licenseGithub.parseFile(licenseContent);
      expect(licenseType).toBe("MIT");
    });

    test("Returns null if no known license is found in the file content", () => {
      const licenseContent = "Some random text without a license mention";
      const licenseType = licenseGithub.parseFile(licenseContent);
      expect(licenseType).toBeNull();
    });

    test("Finds a valid license from the GitHub repository", async () => {
      const t = convexTest(schema);
      const licenseType = await licenseGithub.findLicense("cloudinary", "cloudinary_npm");
      expect(typeof licenseType).toBe("string");
    });
  });

  // NPM License Tests
  describe("NPM", () => {
    test("Calculate the License score for NPM", async () => {
      const t = convexTest(schema);
      await licenseNPM.calculateScoreNPM();
      expect(licenseNPM.getScore()).toBeGreaterThanOrEqual(0);
      expect(licenseNPM.getScore()).toBeLessThanOrEqual(1);
    });

    test("Calculate the latency for License NPM", async () => {
      const t = convexTest(schema);
      await licenseNPM.calculateScoreNPM();
      expect(typeof licenseNPM.getLatency()).toBe("number");
    });

    test("Has a calculateScoreNPM method", () => {
      const t = convexTest(schema);
      expect(typeof licenseNPM.calculateScoreNPM).toBe("function");
    });

    test("Returns a score between 0 and 1 after NPM calculation", async () => {
      const t = convexTest(schema);
      await licenseNPM.calculateScoreNPM();
      const score = licenseNPM.getScore();
      expect(typeof score).toBe("number");
      expect(score).toBeGreaterThanOrEqual(0);
      expect(score).toBeLessThanOrEqual(1);
    });

    test("Finds a valid license from the NPM package metadata", async () => {
      const t = convexTest(schema);
      const licenseType = await licenseNPM.findNPMLicense();
      expect(typeof licenseType).toBe("string");
    });
  });

  // License Rating Tests
  describe("License Rating", () => {
    test("Returns a score of 1.0 for MIT, LGPL, or BSD licenses", () => {
      expect(licenseGithub.rateLicense("MIT")).toBe(1.0);
      expect(licenseGithub.rateLicense("LGPL")).toBe(1.0);
      expect(licenseGithub.rateLicense("BSD")).toBe(1.0);
    });

    test("Returns a score of 0.5 for Apache licenses", () => {
      expect(licenseGithub.rateLicense("APACHE")).toBe(0.5);
      expect(licenseGithub.rateLicense("APACHE-2.0")).toBe(0.5);
    });

    test("Returns a score of 0.2 for GPL licenses", () => {
      expect(licenseGithub.rateLicense("GPL")).toBe(0.2);
    });

    test("Returns a score of 0 for unknown licenses", () => {
      expect(licenseGithub.rateLicense("Unknown")).toBe(0);
    });
  });

  // General Tests
  test("Instance check for License class", () => {
    const t = convexTest(schema);
    expect(licenseGithub).toBeInstanceOf(License);
    expect(licenseNPM).toBeInstanceOf(License);
  });
});
