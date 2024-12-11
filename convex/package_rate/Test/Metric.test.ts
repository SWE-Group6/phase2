import { convexTest } from "convex-test";
import { expect, test, describe } from "vitest";
import schema from "../../schema"; // Assuming schema is defined for Convex

// Importing the Metric class for testing
import { Metric } from "../Models/Metric";

describe("Metric", () => {
  test("Should have a score and latency initialized to 0", () => {
    const t = convexTest(schema);

    class TestMetric extends Metric {
      weight = 0.5;
      calculateScoreGithub(): void {
        console.log("Method not implemented.");
      }
      calculateScoreNPM(): void {
        console.log("Method not implemented.");
      }
    }

    const metric = new TestMetric("https://github.com/cloudinary/cloudinary_npm");
    expect(metric.getScore()).toBe(0);
    expect(metric.getLatency()).toBe(0);
  });

  test("Should be an instance of Metric", () => {
    const t = convexTest(schema);

    class TestMetric extends Metric {
      weight = 0.5;
      calculateScoreGithub() {}
      calculateScoreNPM() {}
    }

    const metric = new TestMetric("https://github.com/cloudinary/cloudinary_npm");
    expect(metric).toBeInstanceOf(Metric);
  });
});
