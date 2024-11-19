import { query } from "../_generated/server";
import { v } from "convex/values";

export const getPackageById = query({
  args: { packageId: v.id("packageTable") }, // Validate that packageId is an ID from "packageTable"
  handler: async (ctx: any, args: any) => {
    const pkg = await ctx.db.get(args.packageId); // Fetch the package by ID
    if (!pkg) {
      throw new Error(`Package with ID ${args.packageId} not found.`);
    }
    return pkg;
  },
});