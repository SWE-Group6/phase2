import { query } from "../_generated/server";
import { v } from "convex/values";

export const getPackageById = query({
  args: { packageId: v.id("packageTable") }, // Validate that packageId is an ID from "packageTable"
  handler: async (ctx: any, args: any) => {
    const pkg = await ctx.db.get(args.packageId); // Fetch the package by ID
    pkg.metadata.ID = pkg._id;
    if (!pkg) {
      throw new Error(`Package with ID ${args.packageId} not found.`);
    }
    return pkg;
  },
});


export const getPackages = query({
    args: {},
    handler: async (ctx: any, args: any) => {
         
        const pkgs = await ctx.db.query("packageTable").collect(); // Fetch all packages
        pkgs.forEach((pkg: any) => {
            pkg.metadata.ID = pkg._id;
        });
        return pkgs;
    },
});
  
  