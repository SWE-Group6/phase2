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
            Correctness: this.packageMetrics.metrics[1].getScore(),
            RampUp: this.packageMetrics.metrics[3].getScore(),
            ResponsiveMaintainer: this.packageMetrics.metrics[2].getScore(),
            LicenseScore: this.packageMetrics.metrics[4].getScore(),
            NetScore: this.packageMetrics.getNetScore()
        };
    }
}