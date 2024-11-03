import { expect } from 'chai';
import { AllMetrics } from '../Models/AllMetrics';

describe('AllMetrics', () => {
  let allMetrics: AllMetrics;
  jest.setTimeout(30000);

  beforeEach(() => {
    allMetrics = new AllMetrics('https://github.com/cloudinary/cloudinary_npm');
  });

  it('should initialize all metrics', () => {
    expect(allMetrics.metrics.length).to.equal(5);
  });

  it('should be an instance of AllMetrics', () => {
    expect(allMetrics).to.be.an.instanceOf(AllMetrics);
  });

  it('should calculate the score for all metrics', async () => {
    await allMetrics.calculateNetScore();
    expect(allMetrics.getNetScore()).to.be.within(0, 1);
  });

  it('should calculate the latency for all metrics', async () => {
    await allMetrics.calculateNetScore(); // Ensure the score is calculated before checking latency
    expect(allMetrics.getNetScoreLatency()).to.be.a('number');
  });

  it('should check the url type for github', () => {
    expect(allMetrics.checkUrlType("https://github.com/cloudinary/cloudinary_npm")).to.equal('github');
  });

  it('should check the url type for npm', () => {
    expect(allMetrics.checkUrlType("https://www.npmjs.com/package/bootstrap")).to.equal('npm');
  });
  it ('should return null if the url is invalid', () => {
    expect(allMetrics.checkUrlType("www.example.com")).to.equal('unknown');
  }); 

});
