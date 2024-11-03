import { expect } from 'chai';
import { ResponsiveMaintainer } from '../Models/ResponsiveMaintainer';

describe('ResponsiveMaintainer', () => {
  let responsiveMaintainerGithub: ResponsiveMaintainer;
  let responsiveMaintainerNPM: ResponsiveMaintainer;

  beforeEach(() => {
    responsiveMaintainerGithub = new ResponsiveMaintainer('https://github.com/cloudinary/cloudinary_npm');
    responsiveMaintainerNPM = new ResponsiveMaintainer('https://www.npmjs.com/package/bootstrap');
  });

  describe('GitHub', () => {
    it('should calculate the ResponsiveMaintainer score', async () => {
      await responsiveMaintainerGithub.calculateScoreGithub();
      expect(responsiveMaintainerGithub.getScore()).to.be.within(0, 1);
    });

    it('should calculate the latency for ResponsiveMaintainer', async () => {
      await responsiveMaintainerGithub.calculateScoreGithub();
      expect(responsiveMaintainerGithub.getLatency()).to.be.a('number');
    });

    it('should have a calculateScoreGithub method', () => {
      expect(responsiveMaintainerGithub.calculateScoreGithub).to.be.a('function');
    });

    it('should return a score between 0 and 1 after calculation', async () => {
      await responsiveMaintainerGithub.calculateScoreGithub();
      const score = responsiveMaintainerGithub.getScore();
      expect(score).to.be.a('number');
      expect(score).to.be.at.least(0);
      expect(score).to.be.at.most(1);
    });
  });

  describe('NPM', () => {
    it('should calculate the ResponsiveMaintainer score for NPM', async () => {
      await responsiveMaintainerNPM.calculateScoreNPM();
      expect(responsiveMaintainerNPM.getScore()).to.be.within(0, 1);
    });

    it('should calculate the latency for ResponsiveMaintainer NPM', async () => {
      await responsiveMaintainerNPM.calculateScoreNPM();
      expect(responsiveMaintainerNPM.getLatency()).to.be.a('number');
    });
  });
}); // Added closing brace for the main describe block
