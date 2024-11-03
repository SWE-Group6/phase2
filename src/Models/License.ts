/* Celedonio G. 
 * NAME: License Metric
 * DESC: Check a packages' license to see if it contains certain words. Fetch
 * thier license file using GitHub API. As stated on our project board: 
 * The license of the npm package should be compatible with the GNU Lesser
 * General Public License v2.1.
 * If the license is fully compatible, the package should score higher.
 * Proper documentation and accessibility of the license is crucial. Points
 * could be awarded based on whether or not the license is clearly stated. 
*/

import {Metric} from "./Metric";
import axios from 'axios'; // simplify GET requests!
import dotenv from 'dotenv'; 

export class License extends Metric {
    public weight: number = 0.2;
    private owner: string = '';
    private repo: string = '';
    private packageName: string = '';

    constructor(url: string) {
        super(url);
        dotenv.config();

        // if the url is GitHub, break down into components for later
        // processing.
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

    // methods for retrieval, identification, and scoring.
    // introduce delays after each request to prevent flooding.

    // PURPOSE: Delay a process so that an API is not flooded with calls.
    // EXPECTED OUTPUT: A new promise after awaiting x ms. (Promise<void>).
    // PARAMETERS: ms: number (the amount to wait in ms before trying again).
    private delay(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // PURPOSE: List the contents of a GitHub url so that I can find the
    // specific contents later.
    // EXPECTED OUTPUT: An array that contains things like 'license.txt',
    // 'license.md', 'license.rst'.
    // PARAMETERS: owner: string, repo: string.
    async listRepoFiles(owner:string, repo: string): Promise<string[]> {
       const apiURL = `https://api.github.com/repos/${owner}/${repo}/contents/`;

       try {
            const response = await axios.get(apiURL, {
                headers: {
                    Authorization: `Bearer ${this.token}`,
                }
            });
            return response.data.map((file: any) => file.name);

       } catch (error) {
            if (error instanceof Error) {
                console.error('Error fetching repo files:', error.message);
                return [];
            } else {
                console.error('An unknown error occurred');
                return [];
            }
       }
    }

    async getFile(owner: string, repo: string, filePath: string): Promise<any> {
       const apiURL = `https://api.github.com/repos/${owner}/${repo}/contents/${filePath}`; 

       try {
            const response = await axios.get(apiURL, {
                headers: {
                    Authorization: `Bearer ${this.token}`,
                }
            });
            return response.data;

       } catch (error) {
           if (error instanceof Error) {
                // set the score to -1 if any error occurs. Should I be explicit
                // with any errors that can occur? (429, 401, 403, 404)
                return null;
           } else {
                console.log('An unknown error occurred');
                return null;
           }
       }
    }

    decodeFile(encodedContent: string): string {
        const theBuffer = Buffer.from(encodedContent, 'base64');
        return theBuffer.toString('utf-8'); // decoded content is now string
    }

    parseJSON(decodedContent: string): string | null {
        try {
            const packageJSON = JSON.parse(decodedContent);
            if (packageJSON.license) {
                return packageJSON.license;
            }
            return null;
        } catch (error) {
        // return null if the json file does not have a license field.
            if (error instanceof Error) {
                // console.error('Error parsing package.json:', error);
                return null;
            }
            else{
                return null;
            }
        }
        
    }

    parseFile(decodedContent: string): string | null {
        const sanitizedContent = decodedContent.toLowerCase();
        console.log("Sanitized Content: ", sanitizedContent);
    
        // Check for more specific licenses first
        if (sanitizedContent.includes('apache-2.0')) {
            return 'APACHE-2.0';
        } else if (sanitizedContent.includes('apache')) {
            return 'APACHE';
        } else if (sanitizedContent.includes('gpl')) {
            return 'GPL';
        } else if (sanitizedContent.includes('lgpl')) {
            return 'LGPL';
        } else if (sanitizedContent.includes('mozilla public license')) {
            return 'MOZILLA';
        } else if (sanitizedContent.includes('bsd')) {
            return 'BSD';
        } else if (sanitizedContent.includes('mit')) {
            // MIT check last since 'mit' can often appear alongside other licenses
            return 'MIT';
        }
    
        // Base case: no license was found in the license file. 
        return null;
    }

    async findLicense(owner: string, repo: string): Promise<string > {
        // many ways to store license files; to not take too long, here are the
        // most important ones I want to consider.
        const repoFiles = await this.listRepoFiles(owner, repo);
        const fileTypes = ['license', 'license.txt', 'license.md', 'package.json'];
        
        for (const file of repoFiles) {
            if (typeof file === 'string') {
                const normalizedFileName = file.toLowerCase();
        
                if (fileTypes.includes(normalizedFileName)) {
                    const fileData = await this.getFile(owner, repo, file);
        
                    if (fileData && fileData.content) {
                        const decodedContent = this.decodeFile(fileData.content);
        
                        if (file === 'package.json') {
                            const licenseType = this.parseJSON(decodedContent);
                            if (licenseType) {
                                return licenseType;
                            }
                        } else {
                            const licenseType = this.parseFile(decodedContent);
                            if (licenseType) {
                                return licenseType;
                            }
                        }
                    }
                }
        
                await this.delay(1000);
            } else {
                // console.warn(`Unexpected file type: ${typeof file}`, file);
            }
        }
        return '';
    }

    async getNPMData(): Promise<any> {
        const apiURL = `https://registry.npmjs.org/${this.packageName}`; 

        try {
            const response = await axios.get(apiURL);
            return response.data;
        } catch (error) {
            if (error instanceof Error) {
                console.error('Error fetching NPM metadata:', error.message);
                return null;
            } else {
                console.error('An unknown error occured'); 
                return null;
            }
        }
    }

    async findNPMLicense(): Promise<string > {
        const metadata = await this.getNPMData();

        if (metadata && metadata.license) {
            const license = metadata.license; 
            return license;
        }
        return '';
    }

    rateLicense(licenseType: string): number {
        //convert to uppercase for easier comparison.
        licenseType = licenseType.toUpperCase();
        let licenseScore = 0;
        if (licenseType === 'MIT' || licenseType === 'LGPL' || licenseType === 'BSD') {
            licenseScore = 1.0;
        } else if (licenseType === 'APACHE' || licenseType === 'APACHE-2.0') {
            licenseScore = 0.5;
        } else if (licenseType === 'GPL') {
            licenseScore = 0.2;
        }
        return licenseScore;
    }

    async calculateScoreGithub(): Promise<void> {
        console.log("Calculating License");
        const start = performance.now();

        // retrieve the license and score the license.
        const license = await this.findLicense(this.owner, this.repo);
        //console.log("License found: ", license);
        const licenseRating = this.rateLicense(license);
        
        const end = performance.now()
        this.latency = end - start;
        this.score = licenseRating;
    }

    async calculateScoreNPM(): Promise<void> {
        console.log("Calculating License");
        const start = performance.now();
        
        const license = await this.findNPMLicense();
        console.log("License found: ", license);
        const licenseRating: number = this.rateLicense(license);

        const end = performance.now()
        this.latency = end - start;
        this.score = licenseRating;
    }
}
