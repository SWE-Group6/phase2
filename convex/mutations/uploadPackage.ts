import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
// Import utility functions.

// Upload a new package by either providing content or a link.
export const uploadPackage = mutation({
	args: { zippedPackage: v.optional(v.string()), // Base64 encoded zip file content.
		linkedPackage: v.optional(v.string()), // URL for the package.
		Name: v.optional(v.string()),
		JSProgram: v.string(), // I guess the helper code that will help?
	},
	handler: async (ctx: any, args: any) => {
		const { zippedPackage, linkedPackage, Name, JSProgram } = args;
		
		let Version: string | null = null; // Extract package version.

		if (linkedPackage) {
			// https://www.geeksforgeeks.org/typescript-string-match-method/
			const match = linkedPackage.match(/\/v(\d+\.\d+\.\d+)/);
			Version = match ? match[1] : "1.0.0"; // Default to 1.0.0 if version is absent.
		} else {
			Version = "1.0.0";
		}

		// Check if package already exists.
		const existingPackage = await ctx.runQuery(api.queries.packageTable.checkPackage, {
			packageName: Name,
			packageVer: Version,
		});

		if (existingPackage) {
			return {
				conflict: true,
				metadata: existingPackage,
			};
		} // Return existing metadata and provide code 409.

		// Upload new package.
		// Before upload, we have to make sure it scores good (call method scoring method).
		// If a zipped package was provided, then the data would be the content. Otherwise, we store the link.
		packageData = zippedPackage ? { Content: zippedPackage, JSProgram } : { URL: linkedPackage, JSProgram };	
		// Abort upload if score does not meet threshold and provide code 424.

		const insertedPackage = await ctx.db.insert("packageTable", { 
			metadata: { Name, Version },
			data: packageData, 
		});

		// After uploading
		return {
			conflict: false, 
			metadata: {
				Name, 
				Version, 
				ID: insertedPackage._id,
			},
			data: packageData,
		};
	},
});
