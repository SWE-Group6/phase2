import * as dotenv from 'dotenv';


export abstract class Metric {
    protected score: number;
    protected latency: number;
    url: string;
    abstract weight: number;
    public token: string;
    
    constructor(url: string) {
        this.score = 0;
        this.latency = 0;
        this.url = url;
        dotenv.config();
        if (process.env.GITHUB_TOKEN) {
            this.token = process.env.GITHUB_TOKEN;
        }
        else {
            // throw an error
            throw new Error("GITHUB_TOKEN not found in .env file");
        }
    }

    getScore(): number {
        return this.score;
    }
    getLatency(): number {
        return this.latency;
    }
    abstract calculateScoreGithub(): void;
    abstract calculateScoreNPM(): void;
}
