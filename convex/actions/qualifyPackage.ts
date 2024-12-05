"use node";

import { api } from "../_generated/api";
import { query, action, ActionCtx } from "../_generated/server";
import { v } from "convex/values";
import { AllMetrics } from "../package_rate/Models/AllMetrics";
import { checkForPackage } from "../queries/packageTable";
import { uploadPackage } from "../mutations/uploadPackage";
import { decodeBase64, unzipFile, findPackageJson, extractVersionFromPackage, debloatBase64Package, getRepoInfo, downloadPackage } from "../actions/packageUtils";

// This action will:
// 1. Validate that either content or URL has been passed.
// 2. Fetch package details from URL or raw content.
// 3. Check if package exists in database.
// 4. Calculate package scores.
// 5. Decide if data should be written.
export const qualifyPackage = action({
    // TODO change args to union 
    // TODO Call ratePackage for link
	args: {
        Data: v.union(
            v.object({
                Content: v.string(),
                JSProgram: v.string(),
                Debloat: v.boolean(),
                Name: v.string(),
            }),
            v.object({
                URL: v.string(),
                JSProgram: v.string(),
            }),
        )
	},
    handler: async (ctx: ActionCtx, args) => {
        if ('Content' in args.Data) { // proceed with 2-5.
			const { Content, JSProgram, Debloat, Name } = args.Data;

			if (!Content) {
				return {
					conflict: true,
					metadata: {
						message: "Content must not be empty.",
						code: 400,
					}
				};
			}

			if (!Name) {
				return {
					conflict: true,
					metadata: {
						message: "Name must be provided when passing content.",
						code: 400,
					},
				};
			}

			// 1. Decode files.
			const decodedFiles = decodeBase64(Content);

			// 2. Unzip package.
			const zip = unzipFile(decodedFiles);

			// 2. Find package.json
			const packageJSON = findPackageJson(zip);

			// 3. Extract version info from the version field.
			let Version = "1.0.0"; // Default to 1.0.0 if version does not exist.

			if (packageJSON) {
				const extractedVersion = extractVersionFromPackage(packageJSON);
				if (extractedVersion) {
					Version = extractedVersion;
				}
			}

			const packageExists = await ctx.runQuery(api.queries.packageTable.checkForPackage, {
				packageName: Name,
				packageVersion: Version,
			});

			if (packageExists) { // package exists, so propogate the error code and display the package.
				return {
					conflict: true,
					metadata: {
						Name: Name,
						Version: Version,
						message: "Package already exists.",
						code: 409,
					}
				};	
			}

            /*
			// Calculate package scores. 
			let packageScore = 0.0; // temp score as I try to figure out how to get the metrics.

			// Decide if data should be written.
			if (packageScore < 0.5) {
				return {
					conflict: true,
					metadata: {
						message: "Package failed to meet minimum requirements.",
						code: 424,
					},
				}
			}
            */

			// Debloat if flagged.
			let processedContent = Content;
			if (Debloat === true) {
				processedContent = await debloatBase64Package(Content);
			}

			// Store data by calling mutation.
			let packageID: String = await ctx.runMutation(api.mutations.uploadPackage.uploadPackage, {
				packageName: Name,
				packageVersion: Version,
				Content: processedContent,
			}); // return the uniqueID to package with all the other details.

			return {
				conflict: false,
				metadata: {
					packageName: Name,
					packageVersion: Version,
					packageID,
					Content: processedContent,
					code: 201,
				}
			};
		} else if ('URL' in args.Data) { // proceed with 2-5.
			const { URL, JSProgram } = args.Data;
			if (!URL) {
				return {
					conflict: true,
					metadata: {
						message: "The provided link is invalid.",
						code: 500,
					},
				};

			}

			if (URL.includes('github.com') || URL.includes('npmjs.com')) { // Reject if it's neither from GitHub or npm.
				// Gather metrics first. If it doesn't qualify, reject.
				const metrics = new AllMetrics(URL);
				let base64Content = "";

				const packageScore = await metrics.calculateNetScore();

				if (packageScore < 0.5) {
					return {
						conflict: true, 
						metadata: {
							message: "Package failed to meet minimum requirements on one or more metric.",
							code: 424,
						}
					};
				} // Continue otherwise.

				let repoInfo = await getRepoInfo(URL); // Download from GitHub as base64 encoded content.
				if (!repoInfo) {
					return {
						conflict: true,
						metadata: {
							message: "Could not determine repo info from the URL",
							code: 400,
						}
					};
				}

				const { owner, repo } = repoInfo;

				try {
					base64Content = await downloadPackage(owner, repo);

					// Decode package to get name, version from package.json
					const decodedContent = decodeBase64(base64Content);
					const unzippedFile = unzipFile(decodedContent);
					const packageJSON = findPackageJson(unzippedFile);

					let packageName = "unknown";
					let packageVersion = "1.0.0";

					if (packageJSON) {
						const extractedVersion = extractVersionFromPackage(packageJSON);
						if (extractedVersion) {
							packageVersion = extractedVersion;
						}
						packageName = repo;
					}

					let packageID: string = await ctx.runMutation(api.mutations.uploadPackage.uploadPackage, {
                        packageName, 
		                packageVersion,
		                Content: base64Content,
		                URL,
					});

					// Return the unique ID as well as package details.
					return {
						conflict: false,
						metadata: {
							packageName,
							packageVersion,
							URL, 
							Content: base64Content,
							code: 201,
						}
					};
				} catch (error) {
					if (error instanceof Error) {
						console.error("Could not get package files:", error);
					} else {
						console.error("An unknown error occurred:", error);
                    }
				}
		} else { // Something else was provided.
			return { 
				conflict: true,
				metadata: {
					message: "An unknown error occurred.",
					code: 500,
				},
			};	
		}	
	
    }
    },
});
