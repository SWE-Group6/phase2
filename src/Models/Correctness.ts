import { Metric } from "./Metric";
import fetch from 'node-fetch';

export class Correctness extends Metric {
    public weight: number = 0.15;
    private packageName: string = '';
    private owner: string = '';
    private repo: string = '';

    constructor(url: string) {
        super(url);
        if (url.includes('github.com')) {
            // generic github url is: https://github.com/owner/repo
            const parts = url.split('/');
            this.owner = parts[3];
            this.repo = parts[4];
        } else if (url.includes('npmjs.com')) {
            // generic npmjs url is: https://npmjs.com/package/{packageName}
            const parts = url.split('/'); 
            this.packageName = parts[4];
        }
    }

    // Calculate score based on GitHub test results
    async calculateScoreGithub(): Promise<void> {
        const start = performance.now();
        const testSuccessRate = await this.getGithubActionTestSuccessRate() || 0;
        this.score = testSuccessRate;
        const end = performance.now();
        this.latency = end - start;
    }

    // Helper method to fetch test success rate from GitHub Actions API
    private async getGithubActionTestSuccessRate(): Promise<number> {
        // console.log("Owner: ", this.owner);
        // console.log("Repo: ", this.repo);
        const githubUrl = `https://api.github.com/repos/${this.owner}/${this.repo}/actions/runs`;
    
        try {

            const response = await fetch(githubUrl, {
                headers: {
                    Authorization: `token ${this.token}`, // Ensure the token is valid
                },
            });
    
            // Check for non-success HTTP status
            if (!response.ok) {
                console.error(`GitHub API responded with status: ${response.status}`);
                return 0; // Return 0 if there's an error
            }
    
            const data = await response.json();
            
            // Log the full data to understand its structure
            //console.log("GitHub API response data:", data);
    
            // Ensure workflow_runs is defined and is an array
            const runs = data.workflow_runs;
            if (!runs || !Array.isArray(runs)) {
                console.log("No workflow runs found or invalid response structure.");
                return 0;
            }
    
            //console.log("Runs: ", runs);
    
            if (runs.length === 0) {
                return 0; // No test runs found
            }
    
            const successRuns = runs.filter((run: any) => run.conclusion === 'success').length; 
            console.log(`Success runs: ${successRuns}, Total runs: ${runs.length}`);
            const successRate = successRuns / runs.length;
    
            return successRate;
        } catch (error) {
            console.error("Error fetching test results from GitHub Actions:", error);
            return 0; // Return 0 if the request fails
        }
    }
    

    // Fetch GitHub URL from the NPM registry and calculate score based on that URL
    async calculateScoreNPM(): Promise<void> {
        const start = performance.now();
        const npmUrl = `https://registry.npmjs.org/${this.packageName}`;

        try {
            const response = await fetch(npmUrl);
            const data = await response.json();

            // Extract the GitHub URL from the NPM metadata
            const repositoryUrl = data.repository?.url;

            if (repositoryUrl && repositoryUrl.includes('github.com')) {
                // Ensure that the URL is in a proper format (strip any "git+" or ".git" suffixes)
                const githubUrl = repositoryUrl.replace(/^git\+/, '').replace(/\.git$/, '');

                // Update the class property `url` with the GitHub URL
                this.url = githubUrl;
                // generic npmjs url is: https://npmjs.com/package/{packageName}
                const parts = this.url.split('/'); 
                this.owner = parts[3];
                this.repo = parts[4];

                // Call the GitHub score calculation method
                await this.calculateScoreGithub();
            } else {
                console.log("GitHub repository URL not found for this package.");
                this.score = 0; // Set score to 0 if no GitHub URL is found
            }
        } catch (error) {
            console.log("Error fetching package info from NPM:", error);
            this.score = 0; // Set score to 0 if the request
        }
        const end = performance.now();
        this.latency = end - start;
    }
}
