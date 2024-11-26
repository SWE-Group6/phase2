import { api } from "../_generated/api";
import { query, action } from "../_generated/server";
import { v } from "convex/values";
import { checkForPackage } from "../queries/packageTable";

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
	handler: async (ctx, args) => {
		if ('Content' && 'URL' in args) {
			return {
				conflict: true,
				metadata: "",
			};
		} else if ('Content' in args) { // proceed with 2-5.
			const { Content, Name } = args;
			const Version = "1.0.0"; // TODO: Make a search method that checks only for name since I can't get version from content. 

			const packageExists = await runQuery(api.queries.packageTable.checkForPackage, {
				packageName: Name,
				packageVersion: Version,
			});

			if (packageExists) { // package exists, so propogate the error code and display the package.
				return {
					conflict: true,
					metadata: {
						Name: Name,
						Version: Version,
					}
				};	
			}

			// Calculate package scores. 
			// Decide if data should be written.
			// Debloat if flagged.
			// Store data by calling mutation.
			
		} else if ('URL' in args) { // proceed with 2-5.
			const { URL, Name } = args;
			const Version = "1.0.0"; // TODO: Get package version via link.
			
			const packageExists = await runQuery(api.queries.packageTable.checkForPackage, {
				packageName: Name,
				packageVersion: Version,
			});

			if (packageExists) { // package exists, so propogate the error code and display the package.
				return {
					conflict: true,
					metadata: {
						Name: Name,
						Version: Version,
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
				metadata: "",
			};	
		}	
	},
});
