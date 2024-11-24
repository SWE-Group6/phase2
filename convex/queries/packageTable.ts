import { query } from "../_generated/server";
import { v } from "convex/values";
import { paginationOptsValidator } from "convex/server";

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


export const getPackagesMetadata = query({
    args: {paginationOpts: paginationOptsValidator},
    handler: async (ctx: any, args: any) => {
         console.log('args:', args);
        const result = await ctx.db.query("packageTable").paginate(args.paginationOpts); // Fetch all packages
        console.log('Paginated Query Result:', result);
        const pkgs = result.page;
        pkgs.forEach((pkg: any) => {
            pkg.metadata.ID = pkg._id;
        });
        //only return the metadata
        const packagesMetadata = pkgs.map((pkg: any) => pkg.metadata);
        console.log('Packages Metadata:', packagesMetadata);
        return {
            packagesData: packagesMetadata,
            cursor: result. continueCursor,
        };
    },
});
  
  