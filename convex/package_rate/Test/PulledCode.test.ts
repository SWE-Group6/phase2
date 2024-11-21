import { expect } from 'chai';
import { PulledCode } from '../Models/PulledCode';


describe('PulledCode', () => {
    describe('Final Output of PulledCode score', () => {
        it('should calculate the PulledCode score', async () => {

            const pulledCode = new PulledCode('https://github.com/cloudinary/cloudinary_npm');
            await pulledCode.calculateScoreGithub();
            expect(pulledCode.getScore()).to.be.within(0, 1);
        }, 60000)

        it('should calculate the latency for PulledCode', async () => {
            const pulledCode = new PulledCode('https://github.com/cloudinary/cloudinary_npm');
            await pulledCode.calculateScoreGithub();
            expect(pulledCode.getLatency()).to.be.a('number');
        }, 60000);

        it('should be an instance of PulledCode', () => {
            const pulledCode = new PulledCode('https://github.com/cloudinary/cloudinary_npm');
            expect(pulledCode).to.be.an.instanceOf(PulledCode);
        });
    })

    /*
    describe('getPullLinesOfCode', () => {
        it('should return lines of code coming from pull requests', async () => {
            const pulledcode = new PulledCode('');
            const pull_lines = await pulledcode.getPullLinesOfCode('SWE-Group6', 'phase1');
            expect(pull_lines).to.equal(8442);
        })
    })

    describe('getTotalCodeLines', () => {
        const expectedTotalLines = 11127; // Your expected total lines of code
        const delta = expectedTotalLines * 0.05;

        it('should return the correct total lines of code', async () => {
            const pulledcode = new PulledCode('https://github.com/SWE-Group6/phase1');
            const totalLines = await pulledcode.getTotalCodeLines('SWE-Group6', 'Software-Engineering-Project');
            expect(totalLines).closeTo(expectedTotalLines, delta);
        }, 60000);
    });

    describe('analyzeUrl', () => {
        it('should return the correct owner and repo', () => {
            const pulledcode = new PulledCode('https://github.com/SWE-Group6/phase1')
            const result = pulledcode.analyzeUrl('https://github.com/microsoft/TypeScript');
            expect(result).to.deep.equal({
                owner: 'microsoft',
                repo: 'TypeScript', // Make sure the repo name matches case sensitivity
            });
        });
    });

    describe('getGitHubUrl', () => {
        it('should return the correct GitHub URL', async () => {
            const pulledcode = new PulledCode('https://www.npmjs.com/package/typescript');
            const gitHubUrl = await pulledcode.getGitHubUrl();
            expect(gitHubUrl).to.equal('https://github.com/microsoft/TypeScript');
        });
    });
    */
});
