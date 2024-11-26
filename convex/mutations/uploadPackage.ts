import { api } from "../_generated/api";
import { mutation } from "../_generated/server";
import { v } from "convex/values";

// This mutation will:
// 1. Upload a package to the database and return its unique ID.
export const uploadPackage = mutation({
	args: {
		packageName: v.string(),
		packageVersion: v.string(),
		Content: v.optional(v.string()),
		URL: v.optional(v.string()),
	},
	handler: async (ctx, args) => {
		const { packageName, packageVersion, Content, URL } = args;

		const packageData = {
			metadata: {
				Name: packageName,
				Version: packageVersion,
			},
			data: Content
			? {
				Content,
			}
			: { 
				URL: URL!,
			},
		};


		const uniqueID = await ctx.db.insert("packageTable", packageData);

		return uniqueID;
	},

});
