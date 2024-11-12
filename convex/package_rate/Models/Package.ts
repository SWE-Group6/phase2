import { AllMetrics } from "./AllMetrics";
import { BusFactor } from "./BusFactor";
import  { Correctness } from "./Correctness";
import { RampUp } from "./RampUp";
import { ResponsiveMaintainer } from "./ResponsiveMaintainer";

export class Package {
    public url: string = "";
    private packageMetrics: AllMetrics;

    constructor(url: string) {
        this.url = url;
        this.packageMetrics = new AllMetrics(url);

        

    }

    public async getMetrics(): Promise<any> {
        // return a json object of all the values of the metrics
        //async call to calculateNetScore
        await Promise.all([this.packageMetrics.calculateNetScore()]);
        console.log("Getting Metrics");
        return {
            URL: this.url,
            NetScore: this.packageMetrics.getNetScore(),
            NetScore_Latency: this.packageMetrics.getNetScoreLatency(),
            //add other metrics
            BusFactor: this.packageMetrics.metrics[0].getScore(),
            BusFactor_Latency: this.packageMetrics.metrics[0].getLatency(),
            Correctness: this.packageMetrics.metrics[1].getScore(),
            Correctness_Latency: this.packageMetrics.metrics[1].getLatency(),
            ResponsiveMaintainer: this.packageMetrics.metrics[2].getScore(),
            ResponsiveMaintainer_Latency: this.packageMetrics.metrics[2].getLatency(),
            RampUp: this.packageMetrics.metrics[3].getScore(),
            RampUp_Latency: this.packageMetrics.metrics[3].getLatency(),
            License: this.packageMetrics.metrics[4].getScore(),
            License_Latency: this.packageMetrics.metrics[4].getLatency()
        };
    }
}