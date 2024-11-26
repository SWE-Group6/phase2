"use node";

import { api } from "../_generated/api";
import { query, action, ActionCtx } from "../_generated/server";
import { v } from "convex/values";
import { checkForPackage } from "../queries/packageTable";
import { uploadPackage } from "../mutations/uploadPackage";

// Schema that ensures either content or URL is provided, but not both.
// If content is provided, name is required. 
const packageUploadArgs = v.union(
	v.object({
		Content: v.string(),
		Name: v.string(),
		URL: v.optional(v.string()), // URL must not be set if content is given.
	}),
	v.object({
		URL: v.string(),
		Content: v.optional(v.string()), // Content must not be set if URL is given.
		Name: v.optional(v.string()), // According to sample, only URL is given when passing URL.
	})
);

// This action will:
// 1. Validate that either content or URL has been passed.
// 2. Fetch package details from URL or raw content.
// 3. Check if package exists in database.
// 4. Calculate package scores.
// 5. Decide if data should be written.
export const qualifyPackage = action({
	args: packageUploadArgs,
	handler: async (ctx: ActionCtx, args) => {
		if ('Content' in args && 'URL' in args) {
			return {
				conflict: true,
				metadata: {
					message: "Cannot provide both content and URL",
				},
			};
		} else if ('Content' in args) { // proceed with 2-5.
			const { Content, Name } = args;
			const Version = "1.0.0"; // TODO: Make a search method that checks only for name since I can't get version from content. 
			
			if (!Name) {
				return {
					conflict: true,
					metadata: {
						message: "Name must be provided when passing content.",
					},
				};
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
					}
				};	
			}

			// Calculate package scores. 
			// Decide if data should be written.
			// Debloat if flagged.
			// Store data by calling mutation.
			let packageID: String = await ctx.runMutation(api.mutations.uploadPackage.uploadPackage, {
				packageName: Name,
				packageVersion: Version,
				Content,
			}); // return the uniqueID to package with all the other details.

			return {
				conflict: false,
				metadata: {
					packageName: Name,
					packageVersion: Version,
					packageID,
					Content,
				}
			};

			
		} else if ('URL' in args) { // proceed with 2-5.
			const { URL } = args;
			const Version = "1.0.0"; // TODO: Get package version via link.

			const parts = URL.split('/');
			let Name = parts[4];

			if (!Name) {
				return {
					conflict: true,
					metadata: {
						message: "Couldn't get name from link provided.",
					},
				};
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
					}
				};	
			}

			// Calculate package scores.
			// Decide if data should be written.
			// No need to debloat.
			// Store data by calling mutation.

		} else { // Something else was provided.
			return { 
				conflict: true,
				metadata: {
					message: "An unknown error occurred.",
				},
			};	
		}	
	},
});
