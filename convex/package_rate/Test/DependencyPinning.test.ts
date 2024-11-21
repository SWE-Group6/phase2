import { expect } from 'chai';
import { DependencyPinning } from '../Models/DependencyPinning';


describe('DependencyPinning', () => {

    describe('Final Output of dependencyPinning score', () => {
        it('should calculate the dependencyPinning score', async () => {

            const dependencyPinning = new DependencyPinning('https://github.com/cloudinary/cloudinary_npm');
            await dependencyPinning.calculateScoreGithub();
            expect(dependencyPinning.getScore()).to.be.within(0, 1);
        }, 60000)

        it('should calculate the latency for dependencyPinning', async () => {
            const dependencyPinning = new DependencyPinning('https://github.com/cloudinary/cloudinary_npm');
            await dependencyPinning.calculateScoreGithub();
            expect(dependencyPinning.getLatency()).to.be.a('number');
        }, 60000);

        it('should be an instance of dependencyPinning', () => {
            const dependencyPinning = new DependencyPinning('https://github.com/cloudinary/cloudinary_npm');
            expect(dependencyPinning).to.be.an.instanceOf(DependencyPinning);
        });
    })

    describe('getPackageJSON', () => {
        it('should return package.JSON file in string format', async () => {
            const dependencyPinning = new DependencyPinning('https://github.com/cloudinary/cloudinary_npm');
            const packageJSON_File = await dependencyPinning.getPackageJSON('cloudinary', 'cloudinary_npm');
            expect(packageJSON_File).to.be.a('string');
        })
    })

    describe('CalculatePinningScore', () => {

        it('should return the dependency fraction value based off of the package.JSON file', async () => {
            const dependencyPinning = new DependencyPinning('https://github.com/cloudinary/cloudinary_npm');
            const jsonString = await dependencyPinning.getPackageJSON('cloudinary', 'cloudinary_npm')
            const score = await dependencyPinning.calculatePinningScore(jsonString);
            expect(score).to.equal(3 / 23);
        }, 60000);

        it('should return the dependency fraction value based off of the package.JSON', async () => {
            const dependencyPinning = new DependencyPinning('https://github.com/facebook/react');
            const jsonString = await dependencyPinning.getPackageJSON('facebook', 'react')
            const score = await dependencyPinning.calculatePinningScore(jsonString);
            expect(score).to.equal(2 / 98);
        }, 60000);
    });

});