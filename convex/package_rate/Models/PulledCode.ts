import { Metric } from './Metric'

const query = `
query($owner: String!, $repo: String!, $cursor: String) {
    repository(owner: $owner, name: $repo) {
      pullRequests(states: MERGED, first: 100, after: $cursor) {
        nodes {
          additions
        }
        pageInfo {
          hasNextPage
          endCursor
        }
      }
      
    }
}
`;

interface PullNode {
    additions: number;
}

interface PageInfo {
    hasNextPage: boolean;
    endCursor: string | null;
}


interface Response {
    data: {
        repository: {
            pullRequests: {
                nodes: PullNode[];
                pageInfo: PageInfo;
            }
        }
    }
}

export class PulledCode extends Metric {
    public weight: number = 0.10;

    constructor(url: string) {
        super(url);
    }

    async calculateScoreGithub(): Promise<void> {
        console.log("Calculating PullCodePercentage");
        const start = Date.now();

        const url_components = this.analyzeUrl(this.url);
        const pulllines = await this.getPullLinesOfCode(url_components.owner, url_components.repo);
        const totallines = await this.getTotalCodeLines(url_components.owner, url_components.repo);

        const end = Date.now();
        this.latency = end - start;
        this.score = totallines / pulllines;
        console.log("Pulled Lines: " + pulllines);
        console.log("Total Lines: " + totallines);
        console.log("Pulled Score: " + this.score);
    }

    async calculateScoreNPM(): Promise<void> {
        console.log("Calculating PullCodePercentage for NPM");
        const start = Date.now();

        const gitHubUrl = await this.getGitHubUrl();

        if (gitHubUrl != null) {
            const url_components = this.analyzeUrl(gitHubUrl);
            const pulllines = await this.getPullLinesOfCode(url_components.owner, url_components.repo);
            const totallines = await this.getTotalCodeLines(url_components.owner, url_components.repo);

            const end = Date.now();
            this.latency = end - start;
            this.score = pulllines / totallines;
        } else {
            const end = Date.now();
            this.latency = end - start;
            this.score = 0;
        }

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

    async getPullLinesOfCode(owner: string, repo: string) {
        let cursor: string | null = null;
        let hasNextPage = true;
        let totalCount = 0;
        const url = 'https://api.github.com/graphql';

        while (hasNextPage) {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${this.token}`,
                },
                body: JSON.stringify({ query, variables: { owner, repo, cursor } }),  // Ensure matching variable names
            });

            const result = await response.json() as Response;

            if (result.data && result.data.repository) {
                const pullRequests = result.data.repository.pullRequests;

                // Sum up additions from each pull request node
                pullRequests.nodes.forEach((node) => {
                    totalCount += node.additions; // Add additions to the total count
                });

                // Update pagination variables
                hasNextPage = pullRequests.pageInfo.hasNextPage;
                cursor = pullRequests.pageInfo.endCursor; // Move to the next cursor for the next page
            } else {
                hasNextPage = false; // Stop if no pull requests are returned
            }
        }

        return totalCount;

    }

    async getTotalCodeLines(owner: string, repo: string) {
        const repoResponse = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
            headers: {
                'Accept': 'application/vnd.github.v3+json',
                'Authorization': `Bearer ${this.token}`,
            },
        });

        if (!repoResponse.ok) {
            throw new Error(`Error fetching repository details: ${repoResponse.status}`)
        }

        const repoData = await repoResponse.json();
        const defaultBranch = repoData.default_branch;

        const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/git/trees/${defaultBranch}?recursive=1`, {
            headers: {
                'Accept': 'application/vnd.github.v3+json',
                'Authorization': `Bearer ${this.token}`,
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();

        let totalLines = 0;

        // Step 3: Calculate the LOC, excluding hidden files
        for (const file of data.tree) {
            // Check if the file is not a directory and doesn't start with a dot
            if (file.type === 'blob' && !file.path.startsWith('.')) {
                const fileResponse = await fetch(file.url, {
                    headers: {
                        'Accept': 'application/vnd.github.v3.raw',
                        'Authorization': `Bearer ${this.token}`,
                    },
                });

                if (fileResponse.ok) {
                    const fileContent = await fileResponse.text();
                    // Count the number of lines in the file content
                    totalLines += fileContent.split('\n').length;
                }
            }
        }

        return totalLines;
    }


}
