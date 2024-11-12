import { expect } from 'chai';
import { BusFactor } from '../Models/BusFactor';

describe('BusFactor', () => {
  it('should calculate the BusFactor score', async () => {
    const busFactor = new BusFactor('https://github.com/cloudinary/cloudinary_npm');
    await busFactor.calculateScoreGithub();
    expect(busFactor.getScore()).to.be.within(0, 1);
  });

  it('should calculate the latency for BusFactor', async () => {
    const busFactor = new BusFactor('https://github.com/cloudinary/cloudinary_npm');
    await busFactor.calculateScoreGithub();
    expect(busFactor.getLatency()).to.be.a('number');
  });

  it('should be an instance of BusFactor', () => {
    const busFactor = new BusFactor('https://github.com/cloudinary/cloudinary_npm');
    expect(busFactor).to.be.an.instanceOf(BusFactor);
  });
});
