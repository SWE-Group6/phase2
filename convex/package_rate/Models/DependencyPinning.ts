import { Metric } from "./Metric";

interface Dependencies {
    [key: string]: string;
}

interface PinnedDependency {
    dependency: string;
    version: string;
}

export class DependencyPinning extends Metric {
    public weight: number = 0.1; // Initialize weight, or set it as needed

    constructor(public url: string) {
        super(url);
    }

    async calculateScoreGithub(): Promise<void> {
        console.log("Calculating DependencyPinning");
        const start = Date.now();

        const url_components = this.analyzeUrl(this.url);
        const packageJSONString = await this.getPackageJSON(url_components.owner, url_components.repo);
        const result = this.calculatePinningScore(packageJSONString);

        const end = Date.now();
        this.latency = end - start;
        this.score = result;
    }

    async calculateScoreNPM(): Promise<void> {
        console.log("Calculating DependencyPinning for NPM");
        const start = Date.now();

        const githubUrl = await this.getGitHubUrl();

        if (githubUrl != null) {
            const url_components = this.analyzeUrl(githubUrl);
            const packageJSONString = await this.getPackageJSON(url_components.owner, url_components.repo);
            const result = this.calculatePinningScore(packageJSONString);

            const end = Date.now();
            this.latency = end - start;
            this.score = result;
        }
        else {
            const end = Date.now()
            this.latency = end - start;
            this.score = 0;
        }

    }

    // Method to check if a dependency is pinned to a specific major+minor version.
    private isDependencyPinned(depVersion: string): boolean {
        return /^(\d+\.\d+)(\.\d+|\.x)$/.test(depVersion);
    }

    // Calculate the fraction of dependencies that are pinned to at least major+minor version
    public calculatePinningScore(packageJSONString: string): number {
        const packageJSON: { dependencies?: Dependencies, devDependencies?: Dependencies } = JSON.parse(packageJSONString);
        const pinnedDependencies: PinnedDependency[] = [];
        let total_dependencies = 0;

        if (packageJSON.dependencies) {
            for (const [dep, version] of Object.entries(packageJSON.dependencies)) {
                if (this.isDependencyPinned(version)) {
                    pinnedDependencies.push({ dependency: dep, version });
                }
                total_dependencies++;
            }
        }

        if (packageJSON.devDependencies) {
            for (const [dep, version] of Object.entries(packageJSON.devDependencies)) {
                if (this.isDependencyPinned(version)) {
                    pinnedDependencies.push({ dependency: dep, version });
                }
                total_dependencies++;
            }
        }

        return pinnedDependencies.length / total_dependencies;
    }

    analyzeUrl(url: string): any {
        const regex = /https?:\/\/github\.com\/([^\/]+)\/([^\/]+)/;
        const match = url.match(regex);

        if (match) {
            return {
                owner: match[1], // First captured group (owner)
                repo: match[2],  // Second captured group (repo)
            };
        }

        return null; // Return null if the URL format is incorrect
    }

    async getGitHubUrl(): Promise<any> {
        // Extract the package name from the URL
        const packageName = this.url.split('/').pop();

        // Fetch the package data from the npm registry
        const response = await fetch(`https://registry.npmjs.org/${packageName}`);

        const data = await response.json();
        const repository = data.repository;


        if (repository && repository.url) {
            let gitHubUrl = repository.url;

            // Handle 'git://' and 'git+https://' formats
            if (gitHubUrl.startsWith('git://')) {
                gitHubUrl = gitHubUrl.replace('git://', 'https://');
            } else if (gitHubUrl.startsWith('git+https://')) {
                gitHubUrl = gitHubUrl.replace('git+https://', 'https://');
            }

            // Remove any trailing '.git' if present
            gitHubUrl = gitHubUrl.replace(/\.git$/, '');

            return gitHubUrl;
        }
    }

    async getPackageJSON(owner: string, repo: string): Promise<any> {
        try {
            const url = `https://api.github.com/repos/${owner}/${repo}/contents/package.json`;
            const response = await fetch(url, {
                headers: {
                    'Authorization': `Bearer ${this.token}`, // Provide your GitHub token
                },
            });

            if (!response.ok) {
                throw new Error(`Failed to fetch package.json: ${response.statusText}`);
            }

            const data = await response.json();
            const decodedContent = atob(data.content);
            const packageJSON = JSON.parse(decodedContent);
            const packageJSONString = JSON.stringify(packageJSON, null, 2);

            return packageJSONString;
        }
        catch (error) {
            console.error('Error fetching package.JSON: ', error);
            throw error;
        }
    }
}