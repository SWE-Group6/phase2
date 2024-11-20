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
        try {
            await Promise.all([this.packageMetrics.calculateNetScore()]);
        } catch (error) {
            console.error('Error calculating metrics:', error);
            //throw a 500 error
            throw new Error('The package rating system choked on at least one of the metrics.');
        }
        console.log("Getting Metrics");
        return {
            BusFactor: this.packageMetrics.metrics[0].getScore(),
            BusFactorLatency: this.packageMetrics.metrics[0].getLatency(),
            Correctness: this.packageMetrics.metrics[1].getScore(),
            CorrectnessLatency: this.packageMetrics.metrics[1].getLatency(),
            RampUp: this.packageMetrics.metrics[3].getScore(),
            RampUpLatency: this.packageMetrics.metrics[3].getLatency(),
            ResponsiveMaintainer: this.packageMetrics.metrics[2].getScore(),
            ResponsiveMaintainerLatency: this.packageMetrics.metrics[2].getLatency(),
            LicenseScore: this.packageMetrics.metrics[4].getScore(),
            LicenseScoreLatency: this.packageMetrics.metrics[4].getLatency(),
            NetScore: this.packageMetrics.getNetScore(),
            NetScoreLatency: this.packageMetrics.getNetScoreLatency()
        };
    }
}