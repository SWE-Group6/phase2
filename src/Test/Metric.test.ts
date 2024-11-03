import { expect } from 'chai';
import { Metric } from '../Models/Metric';

describe('Metric', () => {
  it('should have a score and latency initialized to 0', () => {
    class TestMetric extends Metric {
      weight = 0.5;
      calculateScoreGithub(): void { console.log("Method not implemented."); }
      calculateScoreNPM(): void {
        console.log("Method not implemented.");
      }
    }
    const metric = new TestMetric('https://github.com/cloudinary/cloudinary_npm');
    expect(metric.getScore()).to.equal(0);
    expect(metric.getLatency()).to.equal(0);
  });

  it('should be an instance of Metric', () => {
    class TestMetric extends Metric {
      weight = 0.5;
      calculateScoreGithub() {}
      calculateScoreNPM() {}
    }
    const metric = new TestMetric('https://github.com/cloudinary/cloudinary_npm');
    expect(metric).to.be.an.instanceOf(Metric);
  });
});
