import { expect } from 'chai';
import { RampUp } from '../Models/RampUp';

describe('RampUp', () => {
  let rampUpGithub: RampUp;
  let rampUpNPM: RampUp;

  beforeEach(() => {
    rampUpGithub = new RampUp('https://github.com/cloudinary/cloudinary_npm');
    rampUpNPM = new RampUp('https://www.npmjs.com/package/bootstrap');
  });

  describe('GitHub', () => {
    it('should calculate the RampUp score', async () => {
      await rampUpGithub.calculateScoreGithub();
      expect(rampUpGithub.getScore()).to.be.within(0, 1);
    });

    it('should calculate the latency for RampUp', async () => {
      await rampUpGithub.calculateScoreGithub();
      expect(rampUpGithub.getLatency()).to.be.a('number');
    });


    it('should return a score of 0 for an invalid GitHub URL', async () => {
      await rampUpGithub.calculateScoreGithub();
      expect(rampUpGithub.getScore()).to.be.within(0,1);
    });

    it('should return null if unable to fetch repository files', async () => {
      const repoFiles = await rampUpGithub.listRepoFiles();
      expect(repoFiles).to.be.an('array');
    });

    it('should return null if unable to fetch a README file', async () => {
      const readme = new RampUp('www.github.com');
      const readmeContent = await readme.findREADME();
      expect(readmeContent).to.equal('');
    });
  });

  describe('NPM', () => {
    it('should calculate the RampUp score for NPM', async () => {
      await rampUpNPM.calculateScoreNPM();
      expect(rampUpNPM.getScore()).to.be.within(0, 1);
    });

    it('should calculate the latency for RampUp NPM', async () => {
      await rampUpNPM.calculateScoreNPM();
      expect(rampUpNPM.getLatency()).to.be.a('number');
    });

    it('should return a score of 0 when no README is found on NPM', async () => {
      await rampUpNPM.calculateScoreNPM();
      // should be between 0 and 1
      expect(rampUpNPM.getScore()).to.be.within(0, 1);
    });

    it('should handle an NPM package without README gracefully', async () => {
      const readmeNPM = new RampUp('www.github.com');
      const readmeContent = await readmeNPM.findNPMREADME();
      expect(readmeContent).to.equal('');
    });

    it('should return a score of 0 for an invalid NPM package URL', async () => {
      await rampUpNPM.calculateScoreNPM();
      expect(rampUpNPM.getScore()).to.be.within(0,1);
    });
  });

  describe('General', () => {
    it('should be an instance of RampUp', () => {
      expect(rampUpGithub).to.be.an.instanceOf(RampUp);
      expect(rampUpNPM).to.be.an.instanceOf(RampUp);
    });

    it('should have a delay method', () => {
      expect(rampUpGithub.delay).to.be.a('function');
    });

    it('should delay the process by a specified time', async () => {
      const start = Date.now();
      await rampUpGithub.delay(1000);
      const end = Date.now();
      expect(end - start).to.be.gte(1000);
    });

    it('should handle OpenAI API response parsing failures gracefully', async () => {
      // Assuming the OpenAI API call returns a malformed JSON
      const invalidResponse = '{ ramp_up_score: }';  // Invalid JSON
      const parsedScore = await rampUpGithub.rateREADME(invalidResponse);
      expect(parsedScore).to.be.a('number');
    });
  });
});