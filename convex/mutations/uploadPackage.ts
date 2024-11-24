import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
// Import utility functions.

// Upload a new package by either providing content or a link.
export const uploadPackage = mutation({
	args: { zippedPackage: v.optional(v.string()), // Base64 encoded zip file content.
		linkedPackage: v.optional(v.string()), // URL for the package.
		JSProgram: v.string(), // I guess the helper code that will help?
	},
	handler: async (ctx: any, args: any) => {
		const { zippedPackage, linkedPackage, Name, JSProgram } = args;
		
		let Version: string | null = null; // Extract package version.

		// I can either write more code to get the actual version if not provided or we can just use 1.0.0 as default.
		if (linkedPackage) {
			// https://www.geeksforgeeks.org/typescript-string-match-method/
			const match = linkedPackage.match(/\/v(\d+\.\d+\.\d+)/);
			Version = match ? match[1] : "1.0.0"; // Default to 1.0.0 if version is absent.
		} else {
			Version = "1.0.0";
		}

		// Check if package already exists.

		if (existingPackage) {

		} // Return existing metadata.

		// Upload new package.
		// Before upload, we have to make sure it scores good (call method scoring method).
		// If a zipped package was provided, then the data would be the content. Otherwise, we store the link.
		packageData = zippedPackage ? { Content: zippedPackage, JSProgram } : { URL: linkedPackage, JSProgram };	

		const insertedPackage = await ctx.db.insert("packageTable", { 
			metadata: { Name, Version },
			data: packageData, 
		});

		// After uploading
		return {
			metadata: {
				Name, 
				Version, 
				ID,
			},
			data: packageData,
		};
	},
});
