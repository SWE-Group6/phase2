import { Metric } from "./Metric";
import { BusFactor } from "./BusFactor";
import { Correctness } from "./Correctness";
import { ResponsiveMaintainer } from "./ResponsiveMaintainer";
import { RampUp } from "./RampUp";
import { License } from "./License";
import * as fs from 'fs';

export class AllMetrics {
    // make an array of all metrics
    public metrics: Metric[] = [];
    private netScore: number = 0;
    private netScoreLatency: number = 0;
    private url: string = "";

    constructor(url: string) {
        this.metrics.push(new BusFactor(url));
        this.metrics.push(new Correctness(url));
        this.metrics.push(new ResponsiveMaintainer(url));
        this.metrics.push(new RampUp(url));
        this.metrics.push(new License(url));
        this.url = url;
        
    }
    
    public async calculateNetScore(): Promise<number> {
        if (this.checkUrlType(this.url) === 'npm') {
            await Promise.all(this.metrics.map(metric => metric.calculateScoreNPM()));

            this.metrics.forEach(metric => {
                // console.log(metric.constructor.name);
                // console.log("Score: " + metric.getScore());
                // console.log("Weight: " + metric.weight);
                this.netScore += metric.getScore() * metric.weight;     
                this.netScoreLatency += metric.getLatency();       
            });
        }
        else {
            await Promise.all(this.metrics.map(metric => metric.calculateScoreGithub()));

            this.metrics.forEach(metric => {
                // console.log(metric.constructor.name);
                // console.log("Score: " + metric.getScore());
                // console.log("Weight: " + metric.weight);
                this.netScore += metric.getScore() * metric.weight;
                this.netScoreLatency += metric.getLatency();     
            });
        }

        return this.netScore;
    }

    public getNetScoreLatency(): number {
        return this.netScoreLatency;
    }

    public getNetScore(): number {
        return this.netScore;
    }

    public checkUrlType(url: string): 'npm' | 'github' | 'unknown' {
        const npmRegex = /^(https?:\/\/)?(www\.)?npmjs\.com/i;
        const githubRegex = /^(https?:\/\/)?(www\.)?github\.com/i;
      
        if (npmRegex.test(url)) {
          return 'npm';
        } else if (githubRegex.test(url)) {
          return 'github';
        } else {
          return 'unknown';
        }
      }

}
