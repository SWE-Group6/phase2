"use node";

import { api } from "../_generated/api";
import { query, action, ActionCtx } from "../_generated/server";
import { v } from "convex/values";
import { checkForPackage } from "../queries/packageTable";
import { uploadPackage } from "../mutations/uploadPackage";
import { decodeBase64, unzipFile, findPackageJSON, extractVersionFromPackage, debloatBase64Package } from "../actions/packageUtils";

// This action will:
// 1. Validate that either content or URL has been passed.
// 2. Fetch package details from URL or raw content.
// 3. Check if package exists in database.
// 4. Calculate package scores.
// 5. Decide if data should be written.
export const qualifyPackage = action({
	args: {
		Content: v.optional(v.string()),
		Name: v.optional(v.string()),
		URL: v.optional(v.string()),	
		Debloat: v.optional(v.boolean()),
	},
	handler: async (ctx: ActionCtx, args) => {
		if ('Content' in args && 'URL' in args) {
			return {
				conflict: true,
				metadata: {
					message: "Cannot provide both content and URL",
				},
			};
		} else if ('Content' in args) { // proceed with 2-5.
			const { Content, Name, Debloat } = args;

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
			const packageJSON = findPackageJSON(zip);

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

			
		} else if ('URL' in args) { // proceed with 2-5.
			const { URL } = args;
			if (!URL) {
				return {
					conflict: true,
					metadata: {
						message: "The provided link is invalid.",
					},
				};

			}

			// 1. Verify what link is it: NPM or GitHub.
			if (URL.includes('github.com')) {
			// 2a. If GitHub link:
				// Gather metrics.
				// If package does not pass metrics test, abort.
				// Download package from GitHub as base64 encoded content.
				// Decode the package to get package name and package version from package.json.
				// Store: package name, package version, content, and URL. Use mutation to store and get back uniqueID.
				// Return the uniqueID as well as package details.
			
			} else if (URL.includes('npmjs.com')) {
			// 2b. If NPM link:
				// Gather metrics.
				// If package does not pass metrics test, abort.
				// Download package from NPM as base64 encoded content.
				// Decode the package to get package name and package version from package.json.
				// Store: package name, package version, content, and URL. Use mutation to store and get back uniqueID.
				// Return the uniqueID as well as package details.
			} else {
				return { 
					conflict: true,
					metadata: {
						message: "The provided link is invalid.",
					}
				};
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
	},
});
