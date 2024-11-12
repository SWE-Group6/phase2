import { expect } from 'chai';
import { License } from '../Models/License';

describe('License', () => {
  let licenseGithub: License;
  let licenseNPM: License;
  jest.setTimeout(15000);

  beforeEach(() => {
    licenseGithub = new License('https://github.com/cloudinary/cloudinary_npm');
    licenseNPM = new License('https://www.npmjs.com/package/bootstrap');
  });

  // GitHub License Tests
  describe('GitHub', () => {
    it('should calculate the License score', async () => {
      await licenseGithub.calculateScoreGithub();
      expect(licenseGithub.getScore()).to.be.within(0, 1);
    });

    it('should calculate the latency for License', async () => {
      await licenseGithub.calculateScoreGithub();
      expect(licenseGithub.getLatency()).to.be.a('number');
    });

    it('should have a calculateScoreGithub method', () => {
      expect(licenseGithub.calculateScoreGithub).to.be.a('function');
    });

    it('should return a score between 0 and 1 after calculation', async () => {
      await licenseGithub.calculateScoreGithub();
      const score = licenseGithub.getScore();
      expect(score).to.be.a('number');
      expect(score).to.be.at.least(0);
      expect(score).to.be.at.most(1);
    });

    it('should list files in the GitHub repository', async () => {
      const files = await licenseGithub.listRepoFiles('cloudinary', 'cloudinary_npm');
      expect(files).to.be.an('array');
      expect(files.length).to.be.greaterThan(0);
    });

    it('should return an empty array if the GitHub repository does not exist', async () => {
      const files = await licenseGithub.listRepoFiles('invalid-owner', 'invalid-repo');
      expect(files).to.be.an('array').that.is.empty;
    });

    it('should get a specific file from the GitHub repository', async () => {
      const fileData = await licenseGithub.getFile('cloudinary', 'cloudinary_npm', 'README.md');
      expect(fileData).to.have.property('content');
    });

    it('should return null for a non-existent file in the GitHub repository', async () => {
      const fileData = await licenseGithub.getFile('cloudinary', 'cloudinary_npm', 'non-existent-file.txt');
      expect(fileData).to.be.null;
    });

    it('should decode a base64 string to utf-8', () => {
      const encoded = Buffer.from('Hello, World!').toString('base64');
      const decoded = licenseGithub.decodeFile(encoded);
      expect(decoded).to.equal('Hello, World!');
    });

    it('should parse the license field from a package.json string', () => {
      const jsonString = JSON.stringify({ license: 'MIT' });
      const licenseType = licenseGithub.parseJSON(jsonString);
      expect(licenseType).to.equal('MIT');
    });

    it('should return null for an invalid JSON string', () => {
      const invalidJSONString = "{ license: 'MIT'";
      const licenseType = licenseGithub.parseJSON(invalidJSONString);
      expect(licenseType).to.be.null;
    });

    it('should identify an MIT license in a file content', () => {
      const licenseContent = 'Permission is hereby granted... MIT License...';
      const licenseType = licenseGithub.parseFile(licenseContent);
      expect(licenseType).to.equal('MIT');
    });

    it('should return null if no known license is found in the file content', () => {
      const licenseContent = 'Some random text without a license mention';
      const licenseType = licenseGithub.parseFile(licenseContent);
      expect(licenseType).to.be.null;
    });

    it('should find a valid license from the GitHub repository', async () => {
      const licenseType = await licenseGithub.findLicense('cloudinary', 'cloudinary_npm');
      expect(licenseType).to.be.a('string');
    });
  });

  // NPM License Tests
  describe('NPM', () => {
    it('should calculate the License score for NPM', async () => {
      await licenseNPM.calculateScoreNPM();
      expect(licenseNPM.getScore()).to.be.within(0, 1);
    });

    it('should calculate the latency for License NPM', async () => {
      await licenseNPM.calculateScoreNPM();
      expect(licenseNPM.getLatency()).to.be.a('number');
    });

    it('should have a calculateScoreNPM method', () => {
      expect(licenseNPM.calculateScoreNPM).to.be.a('function');
    });

    it('should return a score between 0 and 1 after NPM calculation', async () => {
      await licenseNPM.calculateScoreNPM();
      const score = licenseNPM.getScore();
      expect(score).to.be.a('number');
      expect(score).to.be.at.least(0);
      expect(score).to.be.at.most(1);
    });

    it('should find a valid license from the NPM package metadata', async () => {
      const licenseType = await licenseNPM.findNPMLicense();
      expect(licenseType).to.be.a('string');
    });
  });

  // License Rating Tests
  describe('License Rating', () => {
    it('should return a score of 1.0 for MIT, LGPL, or BSD licenses', () => {
      expect(licenseGithub.rateLicense('MIT')).to.equal(1.0);
      expect(licenseGithub.rateLicense('LGPL')).to.equal(1.0);
      expect(licenseGithub.rateLicense('BSD')).to.equal(1.0);
    });

    it('should return a score of 0.5 for Apache licenses', () => {
      expect(licenseGithub.rateLicense('APACHE')).to.equal(0.5);
      expect(licenseGithub.rateLicense('APACHE-2.0')).to.equal(0.5);
    });

    it('should return a score of 0.2 for GPL licenses', () => {
      expect(licenseGithub.rateLicense('GPL')).to.equal(0.2);
    });

    it('should return a score of 0 for unknown licenses', () => {
      expect(licenseGithub.rateLicense('Unknown')).to.equal(0);
    });
  });

  // General Tests
  it('should be an instance of License', () => {
    expect(licenseGithub).to.be.an.instanceOf(License);
    expect(licenseNPM).to.be.an.instanceOf(License);
  });
});
