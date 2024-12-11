import { mutation } from "../_generated/server";
import { v } from "convex/values";

export const uploadPackage = mutation({
  args: v.object({
    packageName: v.string(),
    packageVersion: v.string(),
    Content: v.optional(v.string()), // Optional when URL is provided
    URL: v.optional(v.string()), // Optional when Content is provided
    JSProgram: v.optional(v.string()),
    // Optional JavaScript program
    Secret: v.optional(v.boolean()), // Optional secret flag
  }),
  handler: async (ctx, args) => {
    const { packageName, packageVersion, Content, URL, JSProgram, Secret } = args;

    // Validate that at least one of Content or URL is provided
    if (!Content && !URL) {
      throw new Error("Either 'Content' or 'URL' must be provided.");
    }

    // Construct packageData based on the provided arguments
    const packageData = {
      metadata: {
        Name: packageName,
        Version: packageVersion,
        Secret: Secret
      },
      data: URL
        ? {
            URL,
            Content: Content || "", // Empty string when URL is used
            JSProgram: JSProgram || "", // Default to empty string if not provided
          }
        : {
            Content: Content!, // Content is required if URL is not provided
            JSProgram: JSProgram || "", // Default to empty string if not provided
          },
    };

    // Insert the package into the database and return its unique ID
    const uniqueID = await ctx.db.insert("packageTable", packageData);
    console.log(`Package uploaded successfully with ID: ${uniqueID}`);
    return uniqueID;
  },
});