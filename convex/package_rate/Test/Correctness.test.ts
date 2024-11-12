import { expect } from 'chai';
import { Correctness } from '../Models/Correctness';

describe('Correctness', () => {
  let correctnessGithub: Correctness;
  let correctnessNPM: Correctness;

  beforeEach(() => {
    correctnessGithub = new Correctness('https://github.com/cloudinary/cloudinary_npm');
    correctnessNPM = new Correctness('https://www.npmjs.com/package/bootstrap');
  });

  describe('GitHub', () => {
    it('should calculate the Correctness score', async () => {
      await correctnessGithub.calculateScoreGithub();
      expect(correctnessGithub.getScore()).to.be.within(0, 1);
    });

    it('should calculate the latency for Correctness', async () => {
      await correctnessGithub.calculateScoreGithub();
      expect(correctnessGithub.getLatency()).to.be.a('number');
    });

    it('should have a calculateScoreGithub method', () => {
      expect(correctnessGithub.calculateScoreGithub).to.be.a('function');
    });

    it('should return a score between 0 and 1 after calculation', async () => {
      await correctnessGithub.calculateScoreGithub();
      const score = correctnessGithub.getScore();
      expect(score).to.be.a('number');
      expect(score).to.be.at.least(0);
      expect(score).to.be.at.most(1);
    });
  });

  describe('NPM', () => {
    it('should calculate the Correctness score for NPM', async () => {
      await correctnessNPM.calculateScoreNPM();
      expect(correctnessNPM.getScore()).to.be.within(0, 1);
    });

    it('should calculate the latency for Correctness NPM', async () => {
      await correctnessNPM.calculateScoreNPM();
      expect(correctnessNPM.getLatency()).to.be.a('number');
    });

    it('should have a calculateScoreNPM method', () => {
      expect(correctnessNPM.calculateScoreNPM).to.be.a('function');
    });

    it('should return a score between 0 and 1 after NPM calculation', async () => {
      await correctnessNPM.calculateScoreNPM();
      const score = correctnessNPM.getScore();
      expect(score).to.be.a('number');
      expect(score).to.be.at.least(0);
      expect(score).to.be.at.most(1);
    });
  });

  it('should be an instance of Correctness', () => {
    expect(correctnessGithub).to.be.an.instanceOf(Correctness);
    expect(correctnessNPM).to.be.an.instanceOf(Correctness);
  });
});